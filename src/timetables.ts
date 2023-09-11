import { DrizzleD1Database } from "drizzle-orm/d1";
import { DaysInfo, Schedule, days, fetchTimetableData } from "./atmApi";
import { nearStops } from "./config/stops";
import { Time, now } from "./estimates";
import { selectByLineStop, timetablesSQL, upsertSingleTimetable } from "./db/timetables";
import { LineStop, listActive } from "./db/lineStops";

export type DaySchedules = {
  mondaySchedule: Time[] | null,
  tuesdaySchedule: Time[] | null,
  wednesdaySchedule: Time[] | null,
  thursdaySchedule: Time[] | null,
  fridaySchedule: Time[] | null,
  saturdaySchedule: Time[] | null,
  sundaySchedule: Time[] | null,
}

export type Timetable = {
  id: number,
  lineStopId: number,
  customerCode: string,
  lineId: string,
  direction: boolean,
  fromDate: Date | null,
  mondaySchedule: Time[] | null,
  tuesdaySchedule: Time[] | null,
  wednesdaySchedule: Time[] | null,
  thursdaySchedule: Time[] | null,
  fridaySchedule: Time[] | null,
  saturdaySchedule: Time[] | null,
  sundaySchedule: Time[] | null,
};

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

export const updateTimetables = async (
  db: DrizzleD1Database<Record<string, never>>
) => {
  console.log("updating timetables...");

  const ids = nearStops.flatMap((stop) =>
    stop.journeyIds.main.map((journey) => {
      const [lineId, dir] = journey.split("|");
      return { stopCode: stop.customerCode, lineId, dir };
    })
  );

  const lineStops = await listActive(db);


  const promises = lineStops.map(async (lineStop) =>
    updateSingleTimetable(lineStop, db)
      .catch(console.error)
  );

  await Promise.allSettled(promises);
};

const updateSingleTimetable = async (
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<Timetable> => {
  const atmTimetable =
    await fetchTimetableData(lineStop.customerCode, lineStop.lineId, lineStop.direction);

  const timeSchedules = atmTimetable.TimeSchedules;
  const fromDate = atmTimetable.FromDate;

  const schedules: DaySchedules = {
    mondaySchedule: [] as Time[],
    tuesdaySchedule: [] as Time[],
    wednesdaySchedule: [] as Time[],
    thursdaySchedule: [] as Time[],
    fridaySchedule: [] as Time[],
    saturdaySchedule: [] as Time[],
    sundaySchedule: [] as Time[],
  }

  week.forEach((day) => {
    const parseKey = day.charAt(0).toUpperCase() + day.slice(1, 3) as keyof DaysInfo; //Mon, Tue...
    const timetableKey = day + "Schedule" as keyof typeof schedules;

    const schedule = timeSchedules
      .find(({DayType}) => DayType[parseKey])
      ?.Schedule;

    schedules[timetableKey] = schedule
      ? parseScheduleDetail(schedule)
      : [];
  })

  return await upsertSingleTimetable(
    lineStop,
    new Date(fromDate),
    schedules,
    db
  )
};

const parseActiveDaysAsKeys = (daysInfo: DaysInfo) =>
week
  .filter(d => {
    const key = d.charAt(0).toUpperCase() + d.slice(1, 3); //Mon, Tue...
    return daysInfo[key as keyof DaysInfo]
  })
  .map(d => d + "Schedule") //mondaySchedule, ...

export const getTimetable = async (
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<Time[]> => {
  const timetable =
    await selectByLineStop(lineStop, db)
    ?? await updateSingleTimetable(lineStop, db)

  return timetable[getScheduleKey(now().getDay()) as keyof Timetable] as Time[];
};


const week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const getScheduleKey = (day: number): string =>
week[day] + "Schedule";


export default updateTimetables;
