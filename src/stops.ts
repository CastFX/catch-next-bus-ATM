export type MinutesFromHome = {
  type: string;
  minutes: number;
};

export type Stop = {
  id: string;
  customerCode: string;
  name: string;
  location: {
    x: number;
    y: number;
  };
  lineIds: string[];
  journeyIds: { main: string[]; others?: string[]; night?: string[] };
  minutesFromHome: MinutesFromHome[];
};

export const nearStops: Stop[] = [
  {
    id: "4591270",
    name: "Via Mecenate Via Quintiliano",
    customerCode: "12840",
    location: {
      x: 9.252823815443056,
      y: 45.44939909140493,
    },
    lineIds: ["27"],
    journeyIds: { main: ["27|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 10 },
      { type: "normal", minutes: 2 + 8 },
      { type: "fast", minutes: 1 + 6 },
      { type: "bike", minutes: 2 + 3 },
    ],
  },
  {
    id: "4591268",
    name: "Via Mecenate Via Quintiliano",
    customerCode: "12838",
    location: {
      x: 9.253028345035721,
      y: 45.44938063608932,
    },
    lineIds: ["27"],
    journeyIds: { main: ["27|1"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 10 },
      { type: "normal", minutes: 2 + 8 },
      { type: "fast", minutes: 1 + 6 },
      { type: "bike", minutes: 2 + 3 },
    ],
  },
  {
    id: "4591252",
    name: "Via Bonfadini Via del Liri",
    customerCode: "12813",
    location: {
      x: 9.249224547294228,
      y: 45.44518542887491,
    },
    lineIds: ["66", "88"],
    journeyIds: { main: ["66|1", "88|1"], night: ["Q45|0", "Q88|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 3 + 8 },
      { type: "normal", minutes: 2 + 6 },
      { type: "fast", minutes: 1 + 4 },
      { type: "bike", minutes: 2 + 3 },
    ],
  },
  {
    id: "4591253",
    name: "L.go Guerrieri Gonzaga",
    customerCode: "12818",
    location: {
      x: 9.250376030678208,
      y: 45.44532693027197,
    },
    lineIds: ["66", "88"],
    journeyIds: { main: ["66|1", "88|1"], night: ["Q45|0", "Q88|0"] },
    minutesFromHome: [
      { type: "slow", minutes: 4 + 9 },
      { type: "normal", minutes: 3 + 7 },
      { type: "fast", minutes: 1 + 5 },
      { type: "bike", minutes: 2 + 3 },
    ],
  },
  {
    id: "4591254",
    name: "V.le Ungheria | L.go Guerrieri Gonzaga",
    customerCode: "12820",
    location: {
      x: 9.251479130395554,
      y: 45.446089610956015,
    },
    lineIds: ["27", "45", "66", "88", "127"],
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
  },
];

export const getLineStopKey = (lineId: string, stopId: string) =>
  `${stopId}|${lineId}`;
