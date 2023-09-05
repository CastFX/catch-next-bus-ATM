import { LineStatus, fetchStopData } from "./atmApi";
import { Stop, getLineStopKey, nearStops } from "./stops";
import { getTimetable } from "./timetables";

const getMinutesFromNow = (line: LineStatus): number | null => {
  if (line.WaitMessage) {
    const message = line.WaitMessage.trim().toLowerCase();

    if (message.includes("arrivo")) {
      return 0;
    } else if (message.includes("min")) {
      //e.g. "6 min", parseInt("6 min") = 6
      return parseInt(message);
    } else if (message.includes("ricalcolo")) {
      return 15;
    }
  }

  return null;
};

const firstEstimates = (minutesFromNow: number, stop: Stop) => {
  const firstEstimates = stop.minutesFromHome.map((home) => ({
    type: home.type,
    leaveHomeIn_Minutes: minutesFromNow - home.minutes,
    doable: minutesFromNow - home.minutes > 0,
  }));

  return firstEstimates;
};

const getSecondAndThirdTimes = async (
  prev: { hour: number; minute: number },
  line: LineStatus,
  stop: Stop,
  kv_ATMTimetables: KVNamespace<string>
) => {
  const lineId = line.Line.LineCode;
  const dir = line.Direction;
  const stopCode = stop.customerCode;
  const timetable = await getTimetable(stopCode, lineId, dir, kv_ATMTimetables);
  if (!timetable) return [null, null];

  const next = timetable.schedule
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))
    .filter(
      (s) =>
        (prev.hour === s.hour && prev.minute >= s.minute) || prev.hour > s.hour
    );

  return next.slice(0, 2);
};

export const computeTimes = async (
  line: LineStatus,
  stop: Stop,
  kv_ATMTimetables: KVNamespace<string>
) => {
  const minutesFromNow = getMinutesFromNow(line);

  const now = new Date(
    new Date().toLocaleTimeString("it-IT", { timeZone: "Europe/Rome" })
  );

  const arrivesAt =
    minutesFromNow != null
      ? new Date(now.getTime() + minutesFromNow * 60 * 1000)
      : now;

  const arrivingTime = {
    hour: arrivesAt.getHours(),
    minute: arrivesAt.getMinutes(),
  };

  const first = minutesFromNow != null
    ? firstEstimates(minutesFromNow, stop)
    : null;
  const [second, third] = await getSecondAndThirdTimes(
    arrivingTime,
    line,
    stop,
    kv_ATMTimetables
  );

  return JSON.stringify({
    lineId: line.Line.LineId,
    WaitMessage: line.WaitMessage,
    first,
    second,
    third
  });
};

export const updateEstimates = async (
  kv_ATMStops: KVNamespace<string>,
  kv_ATMTimetables: KVNamespace<string>
) => {
  console.log("updating estimates...");

  const stopUpdates = nearStops.map(async (stop) => {
    const data = await fetchStopData(stop.id);

    console.log('stopUpdate Data', data);

    const lineStatuses = stop.lineIds
      .map((lineId) => data.Lines.find((line) => line.Line.LineId === lineId))
      .filter((line): line is LineStatus => !!line);

    console.log('lineStatuses', lineStatuses);

    const kvUpdates = lineStatuses.map((lineStatus) =>
      computeTimes(lineStatus, stop, kv_ATMTimetables).then((times) =>
        kv_ATMStops.put(getLineStopKey(lineStatus.Line.LineId, stop.id), times)
      )
    );

    await Promise.allSettled(kvUpdates);
  });

  await Promise.allSettled(stopUpdates);
};
