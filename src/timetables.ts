import { DaysInfo, Schedule, days, fetchTimetableData } from "./atmApi";
import { nearStops } from "./stops";

export type Timetable = {
  days: number[];
  schedule: {
    hour: number;
    minute: number;
  }[];
};

const getTimetableKey = (stopCode: string, lineId: string, dir: string) =>
  `${stopCode}|${lineId}|${dir}`;

const parseScheduleDetail = (schedules: Schedule[]) => {
  return schedules.flatMap((schedule) => {
    if (!schedule.ScheduleDetail) return [];

    if (schedule.ScheduleDetail.startsWith("Ogni")) {
      try {
        //Ogni 7'[17:06*:20*:35*:49*]
        let matches = schedule.ScheduleDetail
          .match(/Ogni (\d+)'\[\d+:(\d+)/);

        let interval = 0;
        let startMinute = 0;

        if (!matches) {
          //Ogni 7'
          matches = schedule.ScheduleDetail.match(/Ogni (\d+)'/)
          if (!matches) return []

          interval = parseInt(matches[1]);
          startMinute = 0; //TODO: check this, 0 minute is an heuristic
        } else {
          interval = parseInt(matches[1]);
          startMinute = parseInt(matches[2]);
        }

        const minutes = [];
        for (let min = startMinute; min < 60; min += interval) {
            minutes.push(min);
        };
        return minutes.map((minute) =>
          ({hour: schedule.Hour, minute}));
      } catch (e) {
        console.log("error parsing scheduleDetail: ", schedule.ScheduleDetail)
        return []
      }
    }

    return schedule.ScheduleDetail
      .split(" ")
      .filter((Boolean))
      .map((minute) => ({
        hour: schedule.Hour,
        minute: parseInt(minute),
      }))
  });
};

//Sunday = 0, Monday = 1,
const parseActiveDays = (daysInfo: DaysInfo) => {
  return days.flatMap((day, i) => (daysInfo[day] ? [i] : []));
};

export const updateTimetables = async (
  kv_ATMTimetables: KVNamespace<string>
) => {
  console.log("updating timetables...");

  const ids = nearStops.flatMap((stop) =>
    stop.journeyIds.main.map((journey) => {
      const [lineId, dir] = journey.split("|");
      return { stopCode: stop.customerCode, lineId, dir };
    })
  );

  const promises = ids.map(async ({ stopCode, lineId, dir }) =>
    updateSingleTimetable(stopCode, lineId, dir, kv_ATMTimetables)
      .catch(console.error)
  );

  await Promise.allSettled(promises);
};

const updateSingleTimetable = async (
  stopCode: string,
  lineId: string,
  dir: string,
  kv_ATMTimetables: KVNamespace<string>
) => {
  const timetable = await fetchTimetableData(stopCode, lineId, dir);

  const timeSchedules = timetable.TimeSchedules;

  const formattedTimeSchedules: Timetable[] = timeSchedules.map(
    (timeSchedule) => ({
      days: parseActiveDays(timeSchedule.DayType),
      schedule: parseScheduleDetail(timeSchedule.Schedule),
    })
  );

  await kv_ATMTimetables.put(
    getTimetableKey(stopCode, lineId, dir),
    JSON.stringify(formattedTimeSchedules)
  );
};

export const getTimetable = async (
  stopCode: string,
  lineId: string,
  dir: string,
  kv_ATMTimetables: KVNamespace<string>
) => {
  const key = getTimetableKey(stopCode, lineId, dir);
  let json = await kv_ATMTimetables.get(key);
  if (!json) {
    await updateSingleTimetable(stopCode, lineId, dir, kv_ATMTimetables);
    json = await kv_ATMTimetables.get(key);
  }
  const timeTables: Timetable[] = await JSON.parse(json!);
  timeTables.forEach((timeTable) => { //cleanup
    timeTable.schedule = timeTable.schedule.filter(({hour, minute}) =>
      hour != null && minute != null
    )
  });

  const day = new Date().getDay();

  const timeTable = timeTables.find((timeTable) =>
    timeTable.days.includes(day)
  );
  return timeTable;
};

export default updateTimetables;
