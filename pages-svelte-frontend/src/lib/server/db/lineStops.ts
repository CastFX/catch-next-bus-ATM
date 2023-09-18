import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { and, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export type WalkTime = { type: string, minutes: number };

export type GeoSrv = {
  bbox: number[],
  x: number,
  y: number,
}

export type LineEstimates = { lineId: string, waitMessage?: string, estimates: Estimate[][] };

export type Estimate = { type: string, leaveHomeInMinutes: number, doable: boolean, arrivesAt: Date };

export type LineStop = {
  id: number,
  stopCode: string,
  customerCode: string,
  lineId: string,
  lineDescription: string,
  direction: boolean,
  journeyPattern: string,
  locationX: number,
  locationY: number,
  geoSrvData: GeoSrv,
  minutesFromHome: WalkTime[],
  waitMessage: string|null,
  trafficBulletins: string|null,
  estimates: Estimate[][]|null,
  isActive: boolean,
}

export const lineStopsSQL = sqliteTable("lineStops", {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  stopCode: text("stopCode").notNull(),
  customerCode: text("customerCode").notNull(),
  lineId: text("lineId").notNull(),
  lineDescription: text("lineDescription").notNull(),
  direction: integer("direction", {mode:'boolean'}).notNull(),
  journeyPattern: text("journeyPattern").notNull(),
  locationX: real("locationX").notNull(),
  locationY: real("locationY").notNull(),
  geoSrvData: text("geoSrvData", {mode: 'json'}).notNull().$type<GeoSrv>(),
  minutesFromHome: text("minutesFromHome", {mode: 'json'}).notNull().$type<WalkTime[]>(),
  waitMessage: text("waitMessage"),
  trafficBulletins: text("trafficBulletins"),
  estimates: text("estimates", {mode: 'json'}).$type<Estimate[][]>(),
  isActive: integer("isActive", {mode: 'boolean'}).notNull().default(true),
});


export const selectByLineIdAndStopCode = async (
  lineId: string,
  stopCode: string,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<LineStop|null> => {
  const result = await db
    .select()
    .from(lineStopsSQL)
    .where(eq(lineStopsSQL.lineId, lineId))
    .where(eq(lineStopsSQL.stopCode, stopCode));

  return result[0];
}

export const listActive = async (
  db: DrizzleD1Database<Record<string, never>>,
): Promise<LineStop[]> => {
  const result = await db
    .select()
    .from(lineStopsSQL)
    .where(eq(lineStopsSQL.isActive, true))

  return result;
}

export const setLineEstimates = async (
  lineId: string,
  stopCode: string,
  lineEstimates: LineEstimates,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<void> => {
  const {waitMessage, estimates} = lineEstimates;

  await db.update(lineStopsSQL)
    .set({waitMessage, estimates})
    .where(and(
      eq(lineStopsSQL.lineId, lineId),
      eq(lineStopsSQL.stopCode, stopCode),
    ));
}

export const setStopCode = async (
  lineStop: LineStop,
  stopCode: string,
  db: DrizzleD1Database<Record<string, never>>,
): Promise<void> => {
  await db.update(lineStopsSQL)
    .set({stopCode})
    .where(eq(lineStopsSQL.id, lineStop.id));
}