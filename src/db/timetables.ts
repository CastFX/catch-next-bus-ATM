import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Time } from "../estimates";
import { LineStop, lineStopsSQL } from "./lineStops";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { DaySchedules, Timetable } from "../timetables";

export const timetablesSQL = sqliteTable("timetables", {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  lineStopId: integer("lineStopId").unique().notNull().references(() => lineStopsSQL.id),
  customerCode: text("customerCode").notNull(),
  lineId: text("lineId").notNull(),
  direction: integer("direction", {mode:'boolean'}).notNull(),
  fromDate: integer("fromDate", {mode: 'timestamp'}),
  mondaySchedule: text("mondaySchedule", {mode: 'json'}).$type<Time[]>(),
  tuesdaySchedule: text("tuesdaySchedule", {mode: 'json'}).$type<Time[]>(),
  wednesdaySchedule: text("wednesdaySchedule", {mode: 'json'}).$type<Time[]>(),
  thursdaySchedule: text("thursdaySchedule", {mode: 'json'}).$type<Time[]>(),
  fridaySchedule: text("fridaySchedule", {mode: 'json'}).$type<Time[]>(),
  saturdaySchedule: text("saturdaySchedule", {mode: 'json'}).$type<Time[]>(),
  sundaySchedule: text("sundaySchedule", {mode: 'json'}).$type<Time[]>(),
});

export const selectByLineStop = async (
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<Timetable|null> => {
  const result = await db
    .select()
    .from(timetablesSQL)
    .where(eq(timetablesSQL.lineStopId, lineStop.id))
    .all();

    return result[0];
}


export const upsertSingleTimetable = async (
  lineStop: LineStop,
  fromDate: Date | null,
  schedules: DaySchedules,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<Timetable> => {
  const timetables: Timetable[] = await db
    .insert(timetablesSQL)
    .values({
      lineStopId: lineStop.id,
      customerCode: lineStop.customerCode,
      lineId: lineStop.lineId,
      direction: lineStop.direction,
      fromDate,
      ...schedules,
    })
    .onConflictDoUpdate({ target: timetablesSQL.lineStopId, set: {fromDate, ...schedules} })
    .returning();

    return timetables[0];
}

export const listTimetables = async (
  db: DrizzleD1Database<Record<string, never>>
): Promise<Timetable[]> => {
  const result = await db
    .select()
    .from(timetablesSQL)
    .all();

  return result;
}
