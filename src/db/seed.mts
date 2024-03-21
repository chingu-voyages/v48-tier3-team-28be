import { Prisma, PrismaClient } from '@prisma/client';
import stations from '../../stations_generated_at_2024-03-20T21:21:31.494Z.json';
import readings from '../../readings_generated_at_2024-03-21T22:36:27.552Z.json';

const dbClient = new PrismaClient();

async function main() {
  console.log('Seeding...');
  console.log("Number of Stations found: ", stations.length);
  console.log("Inserting Stations");

  const stationValues = stations.map(data => {
    return Prisma.sql`(
     ${Prisma.join([ data.stationReference, data.town, data.riverName, data.catchmentName, data.datumOffset, Prisma.sql`${data.dateOpened}::date`, `POINT(${data.long} ${data.lat})` ])}
    )`;
  });

  console.log("Station Values: ", stationValues.slice(0, 5));

  const insertStationsResponse = await dbClient.$executeRaw`
    INSERT INTO "station" ("station_reference", "town", "river_name", "catchment_name", "datum_offset", "date_opened", "location")
    VALUES ${Prisma.join(stationValues)}
    ON CONFLICT DO NOTHING;`;

  console.log("Inserted Stations: ", insertStationsResponse);
  console.log("Number of Readings found: ", readings.length);
  console.log("Inserting Readings");

  const readingValues = readings.map(reading => Prisma.sql`(
    ${Prisma.join([ reading.stationReference, reading.qualifier, Prisma.sql`${reading.readingDate}::timestamptz`, reading.value ])}
  )`);

  const insertReadingsResponse = await dbClient.$executeRaw`INSERT INTO "reading" (
    "station_reference",
    "qualifier",
    "reading_date",
    "value"
  ) VALUES ${Prisma.join(readingValues)} ON CONFLICT DO NOTHING;`;

  console.log("Inserted Readings: ", insertReadingsResponse);
  console.log('Seeding complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  console.log('Disconnecting DB Client...');
});