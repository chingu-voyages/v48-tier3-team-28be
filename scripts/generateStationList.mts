import fs from 'node:fs'

interface Root {
  "@context": string
  meta: Meta
  items: Item[]
}

interface Meta {
  publisher: string
  licence: string
  documentation: string
  version: string
  comment: string
  hasFormat: string[]
}

interface Item {
  "@id": string
  RLOIid: any
  catchmentName?: string
  dateOpened: any
  easting: any
  label: any
  lat: any
  long: any
  measures: Measure[]
  northing: any
  notation: string
  riverName?: string
  stageScale?: string
  stationReference: string
  status: any
  town?: string
  wiskiID: any
  datumOffset?: number
  gridReference?: string
  downstageScale?: string
}

interface Measure {
  "@id": string
  parameter: string
  parameterName: string
  period: number
  qualifier: string
  unitName: string
}

type Station = Pick<Item, 'town' | 'stationReference' | 'riverName' | 'catchmentName' | 'datumOffset' | 'dateOpened' | 'lat' | 'long'>;

const generateFilename = () => {
  const timestamp = new Date().toISOString();
  return `./stations_generated_at_${timestamp}.json`;
};

const saveDataToFile = async (data: Station[]) => {
  const filePath = generateFilename();
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`💾   Data has been saved to ${filePath}`);
  });
};

const fetchData = async () => {
  try {
    console.log(`⌛   Fetching station list...`);

    const response = await fetch('http://environment.data.gov.uk/flood-monitoring/id/stations?parameter=level');
    const data = await response.json() as Root;

    return data.items
      .filter((item: any) => item.town && item.stationReference && item.catchmentName && item.riverName && (!item.status || item.status.includes('statusActive')))
      .map((item: any) => ({
          town: item.town,
          stationReference: item.stationReference,
          riverName: item.riverName,
          catchmentName: item.catchmentName,
          datumOffset: item.datumOffset ?? null,
          dateOpened: item.dateOpened,
          lat: item.lat,
          long: item.long,
      } satisfies Station));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


const run = async () => {
    const stations = await fetchData();
    if (stations.length > 0) {
          console.log(`✅   Found ${stations.length} stations`);
        await saveDataToFile(stations);
    } else {
        console.log('No active stations found or an error occurred.');
    }
};

run();