import { LineStatus, fetchStopData } from "./atmApi";
import { Stop, getLineStopKey, nearStops } from "./stops";
import { getTimetable } from "./timetables";

const getMinutesFromNow = (line: LineStatus): number => {
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

    throw new Error(`Invalid message: ${message}`);
  }

  return -1;
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
    .sort(dateChronologically)
    .filter(isAfterPrevious(prev));

  return next.slice(0, 2);
};

export const computeTimes = async (
  line: LineStatus,
  stop: Stop,
  kv_ATMTimetables: KVNamespace<string>
) => {
  const minutesFromNow = getMinutesFromNow(line);

  const now = new Date(
    new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" })
  );

  const arrivesAt = new Date(now.getTime() + minutesFromNow * 60 * 1000);

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

    const lineStatuses = stop.lineIds
      .map((lineId) => data.Lines.find((line) => line.Line.LineId === lineId))
      .filter((line): line is LineStatus => !!line);

    const kvUpdates = lineStatuses.map((lineStatus) =>
      computeTimes(lineStatus, stop, kv_ATMTimetables)
        .then((times) =>
          kv_ATMStops.put(
            getLineStopKey(lineStatus.Line.LineId, stop.id),
            times
          ))
        .catch((error) => !error.message.startsWith("Invalid")
          && console.error("compute times error: ", error.message))
    );

    await Promise.allSettled(kvUpdates);
  });

  await Promise.allSettled(stopUpdates);
};

type Time = { hour: number; minute: number };

const dateChronologically = (a: Time, b: Time) =>
a.hour * 60 + a.minute - (b.hour * 60 + b.minute)

const isAfterPrevious = (prev: Time) => (next: Time) =>
(prev.hour === next.hour && next.minute >= prev.minute + 3)
|| next.hour > prev.hour