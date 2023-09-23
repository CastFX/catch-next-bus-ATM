DROP TABLE IF EXISTS lineStops;
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
(1, '4591270', '12840', '27', 'Via Mecenate Via Quintiliano', 0, '27|0', 9.252823815443056, 45.44939909140493, '{"bbox":[1029369.7832640308,5692311.4391867425,1030762.3703731381,5692711.539256683],"x":542,"y":145}', '[{"type":"slow","minutes":13},{"type":"walk","minutes":10},{"type":"fast","minutes":7},{"type":"bike","minutes":5}]', 0, 1695467745075),
(2, '4591268', '12838', '27', 'Via Mecenate Via Quintiliano', 1, '27|1', 9.253028345035721, 45.44938063608932, '{"bbox":[1029369.7832640308,5692311.4391867425,1030762.3703731381,5692711.539256683],"x":546,"y":138}', '[{"type":"slow","minutes":13},{"type":"walk","minutes":10},{"type":"fast","minutes":7},{"type":"bike","minutes":5}]', 0, 1695467745075),
(3, '4591252', '12813', '66', 'Via Bonfadini Via del Liri', 1, '66|1', 9.249224547294228, 45.44518542887491, '{"bbox":[1029519.5502001934,5691607.65775191,1030912.1373093007,5692007.7578218505],"x":84,"y":119}', '[{"type":"slow","minutes":11},{"type":"walk","minutes":8},{"type":"fast","minutes":5},{"type":"bike","minutes":5}]', 1, 1695467745075),
(4, '4591252', '12813', '88', 'Via Bonfadini Via del Liri', 1, '88|1', 9.249224547294228, 45.44518542887491, '{"bbox":[1029519.5502001934,5691607.65775191,1030912.1373093007,5692007.7578218505],"x":84,"y":119}', '[{"type":"slow","minutes":11},{"type":"walk","minutes":8},{"type":"fast","minutes":5},{"type":"bike","minutes":5}]', 1, 1695467745075),
(5, '4591253', '12818', '66', 'L.go Guerrieri Gonzaga', 1, '66|1', 9.250376030678208, 45.44532693027197, '{"bbox":[1029309.6199754311,5691663.38974433,1030556.8509552581,5692021.727976099],"x":418,"y":110}', '[{"type":"slow","minutes":13},{"type":"walk","minutes":10},{"type":"fast","minutes":6},{"type":"bike","minutes":5}]', 1, 1695467745075),
(6, '4591253', '12818', '88', 'L.go Guerrieri Gonzaga', 1, '88|1', 9.250376030678208, 45.44532693027197, '{"bbox":[1029309.6199754311,5691663.38974433,1030556.8509552581,5692021.727976099],"x":418,"y":110}', '[{"type":"slow","minutes":13},{"type":"walk","minutes":10},{"type":"fast","minutes":6},{"type":"bike","minutes":5}]', 1, 1695467745075),
(7, '4591254', '12820', '27', 'V.le Ungheria | L.go Guerrieri Gonzaga', 1, '27|1', 9.251479130395554, 45.446089610956015, '{"bbox":[1029272.4443194495,5691796.617093201,1030665.0314285568,5692196.717163141],"x":497,"y":146}', '[{"type":"slow","minutes":11},{"type":"walk","minutes":8},{"type":"fast","minutes":5},{"type":"bike","minutes":5}]', 1, 1695467745075),
(8, '4591254', '12820', '45', 'V.le Ungheria | L.go Guerrieri Gonzaga', 1, '45|1', 9.251479130395554, 45.446089610956015, '{"bbox":[1029272.4443194495,5691796.617093201,1030665.0314285568,5692196.717163141],"x":497,"y":146}', '[{"type":"slow","minutes":11},{"type":"walk","minutes":8},{"type":"fast","minutes":5},{"type":"bike","minutes":5}]', 1, 1695467745075);
DROP TABLE IF EXISTS timetables;
CREATE TABLE IF NOT EXISTS timetables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lineStopId INTEGER NOT NULL UNIQUE,
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
  