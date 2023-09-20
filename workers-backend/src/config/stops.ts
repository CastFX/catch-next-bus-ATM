import { DrizzleD1Database } from "drizzle-orm/d1";
import {
  GeoSrv,
  LineStop,
  WalkTime,
  listActive,
  setStopCode,
} from "../db/lineStops";
import { ATM_StopInfo_Response, fetchStopCode } from "../atmApi";

export type Stop = {
  stopCode: string; //suggested to changes
  customerCode: string; //stable
  name: string;
  location: {
    x: number;
    y: number;
  };
  geoSrvData: GeoSrv;
  lineIds: string[];
  journeyIds: { main: string[]; others?: string[]; night?: string[] };
  minutesFromHome: WalkTime[];
  active: Boolean;
};

export const nearStops: Stop[] = [
  {
    stopCode: "4591270",
    name: "Via Mecenate Via Quintiliano",
    customerCode: "12840",
    location: {
      x: 9.252823815443056,
      y: 45.44939909140493,
    },
    geoSrvData: {
      bbox: [
        1029369.7832640308, 5692311.4391867425, 1030762.3703731381,
        5692711.539256683,
      ],
      x: 542,
      y: 145,
    },
    lineIds: ["27"],
    journeyIds: { main: ["27|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 10 },
      { type: "normal", minutes: 2 + 8 },
      { type: "fast", minutes: 1 + 6 },
      { type: "bike", minutes: 2 + 3 },
    ],
    active: false,
  },
  {
    stopCode: "4591268",
    name: "Via Mecenate Via Quintiliano",
    customerCode: "12838",
    location: {
      x: 9.253028345035721,
      y: 45.44938063608932,
    },
    geoSrvData: {
      bbox: [
        1029369.7832640308, 5692311.4391867425, 1030762.3703731381,
        5692711.539256683,
      ],
      x: 546,
      y: 138,
    },
    lineIds: ["27"],
    journeyIds: { main: ["27|1"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 10 },
      { type: "normal", minutes: 2 + 8 },
      { type: "fast", minutes: 1 + 6 },
      { type: "bike", minutes: 2 + 3 },
    ],
    active: false,
  },
  {
    stopCode: "4591252",
    name: "Via Bonfadini Via del Liri",
    customerCode: "12813",
    location: {
      x: 9.249224547294228,
      y: 45.44518542887491,
    },
    geoSrvData: {
      bbox: [
        1029519.5502001934, 5691607.65775191, 1030912.1373093007,
        5692007.7578218505,
      ],
      x: 84,
      y: 119,
    },
    lineIds: ["66", "88"],
    journeyIds: { main: ["66|1", "88|1"], night: ["Q45|0", "Q88|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 8 },
      { type: "normal", minutes: 2 + 6 },
      { type: "fast", minutes: 1 + 4 },
      { type: "bike", minutes: 2 + 3 },
    ],
    active: true,
  },
  {
    stopCode: "4591253",
    name: "L.go Guerrieri Gonzaga",
    customerCode: "12818",
    location: {
      x: 9.250376030678208,
      y: 45.44532693027197,
    },
    geoSrvData: {
      bbox: [
        1029309.6199754311, 5691663.38974433, 1030556.8509552581,
        5692021.727976099,
      ],
      x: 418,
      y: 110,
    },
    lineIds: ["66", "88"],
    journeyIds: { main: ["66|1", "88|1"], night: ["Q45|0", "Q88|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 4 + 9 },
      { type: "normal", minutes: 3 + 7 },
      { type: "fast", minutes: 1 + 5 },
      { type: "bike", minutes: 2 + 3 },
    ],
    active: true,
  },
  {
    stopCode: "4591254",
    name: "V.le Ungheria | L.go Guerrieri Gonzaga",
    customerCode: "12820",
    location: {
      x: 9.251479130395554,
      y: 45.446089610956015,
    },
    geoSrvData: {
      bbox: [
        1029272.4443194495, 5691796.617093201, 1030665.0314285568,
        5692196.717163141,
      ],
      x: 497,
      y: 146,
    },
    lineIds: ["27", "45"], // "66", "88", "127"],
    journeyIds: {
      main: ["27|1", "45|1"],
      others: ["66|0", "88|0"],
      night: ["N27|0"],
    },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 8 },
      { type: "normal", minutes: 2 + 6 },
      { type: "fast", minutes: 1 + 4 },
      { type: "bike", minutes: 2 + 3 },
    ],
    active: true,
  },
];

export const updateStopCodes = async (
  db: DrizzleD1Database<Record<string, never>>
): Promise<void> => {
  const lineStops = await listActive(db);
  const promises = lineStops.map((lineStop) =>
    fetchStopCode(lineStop).then((info) => updateStopCode(info, lineStop, db))
  );

  await Promise.allSettled(promises);
};

const updateStopCode = async (
  data: ATM_StopInfo_Response,
  lineStop: LineStop,
  db: DrizzleD1Database<Record<string, never>>
): Promise<void> => {
  const stopCode = data.features?.[0]?.properties?.ID;
  if (!stopCode) {
    console.log("no stopCode");
    return;
  }

  await setStopCode(lineStop, stopCode.toFixed(), db);
};
