import { DrizzleD1Database } from "drizzle-orm/d1";
import { ATM_LineStatus_Response, LineStatus, fetchStopData } from "./atmApi";
import { getTimetable } from "./timetables";
import { LineStop, listActive, setLineEstimates } from "./db/lineStops";

export type WalkTime = { type: string, minutes: number };

export type Time = { hour: number; minute: number };

export type Estimate = { type: string, leaveHomeInMinutes: number, doable: boolean, arrivesAt: Date };

export type LineEstimates = { lineId: string, waitMessage?: string, estimates: Estimate[][] };

const getMinutesFromNow = (line: LineStatus): number => {
  if (line.WaitMessage) {
    const message = line.WaitMessage.trim().toLowerCase();

    if (message.includes("arrivo")) {
      return 1;
    } else if (message.includes("min")) {
      //e.g. "6 min", parseInt("6 min") = 6
      return parseInt(message);
    } else if (message.includes("ricalcolo")) {
      return -1;
    }

    throw new Error(`Invalid message: ${message}`);
  }

  return -1;
};

const firstEstimates = (
  minutesFromNow: number,
  arrivesAt: Date,
  lineStop: LineStop,
): Estimate[] => {
  return lineStop.minutesFromHome.map((home) => ({
    type: home.type,
    leaveHomeInMinutes: minutesFromNow - home.minutes,
    doable: minutesFromNow - home.minutes > 0,
    arrivesAt,
  }));
};

const getSecondAndThirdTimes = async (
  prev: { hour: number; minute: number },
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<Estimate[][]> => {
  if (!lineStop) return [];
  const timetable = await getTimetable(lineStop, db);
  if (!timetable) return [];

  const next = timetable
    .sort(dateChronologically)
    .filter(isAfterPrevious(prev));

  return next.slice(0, 2).map((time) =>
    lineStop.minutesFromHome.map((home) => {
      const arrivesAt = now()
      arrivesAt.setHours(time.hour, time.minute, 0);
      const seconds = (arrivesAt.getTime() - now().getTime()) / 1000;
      const minutesFromArrival = Math.ceil(seconds / 60);

      return {
        type: home.type,
        leaveHomeInMinutes: minutesFromArrival - home.minutes,
        doable: minutesFromArrival - home.minutes > 0,
        arrivesAt,
      }
    })
  );
};

export const computeTimes = async (
  line: LineStatus,
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<LineEstimates> => {
  const minutesFromNow = getMinutesFromNow(line);

  const arrivesAt = new Date(now().getTime() + minutesFromNow * 60 * 1000);

  const arrivingTime = {
    hour: arrivesAt.getHours(),
    minute: arrivesAt.getUTCMinutes(),
  };

  const first = minutesFromNow != null
    ? firstEstimates(minutesFromNow, arrivesAt, lineStop)
    : undefined;
  const [second, third] = await getSecondAndThirdTimes(
    arrivingTime,
    lineStop,
    db,
  );

  return {
    lineId: line.Line.LineId,
    waitMessage: line.WaitMessage,
    estimates: [first, second, third]
      .filter(Boolean) as Estimate[][],
  };
};

export const updateEstimates = async (
  db: DrizzleD1Database<Record<string, never>>
) => {
  console.log("updating estimates...");

  const lineStops = await listActive(db);

  const cache = {} as { [key: string]: Promise<ATM_LineStatus_Response> };

  const stopUpdates = lineStops.map(async (lineStop) => {
    const promise = lineStop.stopCode in cache
      ? cache[lineStop.stopCode]
      : fetchStopData(lineStop.stopCode);

    const data = await promise;

    const lineStatus =
      findLineStatusById(data.Lines, lineStop.lineId);

    if (!lineStatus) return Promise.resolve();

    return computeTimes(lineStatus, lineStop, db)
      .then((lineEstimates) => setLineEstimates(
        lineStatus.Line.LineId,
        lineStop.stopCode,
        lineEstimates,
        db,
      ))
  });

  await Promise.allSettled(stopUpdates);
};

export const now = () => new Date(
  new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" })
);

const dateChronologically = (a: Time, b: Time) =>
a.hour * 60 + a.minute - (b.hour * 60 + b.minute)

const isAfterPrevious = (prev: Time) => (next: Time) =>
(prev.hour === next.hour && next.minute >= prev.minute + 3)
|| next.hour > prev.hour

const findLineStatusById = (lines: LineStatus[], lineId: string): LineStatus | undefined =>
  lines.find((line) => line.Line.LineId === lineId)