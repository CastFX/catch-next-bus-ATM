import { nearStops } from "../../config/stops";

export const writeSchemaSQL = async () => {
  let c = 1;
  const schema = `DROP TABLE IF EXISTS lineStops;
CREATE TABLE IF NOT EXISTS lineStops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stopCode TEXT NOT NULL,
  customerCode TEXT NOT NULL,
  lineId TEXT NOT NULL,
  lineDescription TEXT,
  direction INTEGER NOT NULL,
  journeyPattern TEXT NOT NULL,
  locationX REAL NOT NULL,
  locationY REAL NOT NULL,
  geoSrvData TEXT NOT NULL,
  minutesFromHome TEXT NOT NULL,
  waitMessage TEXT,
  trafficBulletins TEXT,
  estimates TEXT,
  isActive INTEGER,
  lastUpdatedAt INTEGER
);
INSERT INTO lineStops (id, stopCode, customerCode, lineId, lineDescription, direction, journeyPattern, locationX, locationY, geoSrvData, minutesFromHome, isActive, lastUpdatedAt)
VALUES
${nearStops
  .flatMap((stop) =>
    stop.journeyIds.main.map((journeyId) => [
      `(${c++}, '${stop.stopCode}', '${stop.customerCode}', '${
        journeyId.split("|")[0]
      }', '${stop.name}', ${parseInt(
        journeyId.split("|")[1]
      )}, '${journeyId}', ${stop.location.x}, ${
        stop.location.y
      }, '${JSON.stringify(stop.geoSrvData)}', '${JSON.stringify(
        stop.minutesFromHome
      )}', ${stop.active ? 1 : 0}, ${new Date().getTime()})`,
    ])
  )
  .join(",\n")};
DROP TABLE IF EXISTS timetables;
CREATE TABLE IF NOT EXISTS timetables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lineStopId TEXT NOT NULL UNIQUE,
  customerCode TEXT NOT NULL,
  lineId TEXT NOT NULL,
  direction INTEGER NOT NULL,
  fromDate DATE,
  mondaySchedule TEXT,
  tuesdaySchedule TEXT,
  wednesdaySchedule TEXT,
  thursdaySchedule TEXT,
  fridaySchedule TEXT,
  saturdaySchedule TEXT,
  sundaySchedule TEXT
);
  `;

  await Bun.write(__dirname + "/schema.sql", schema);
};
