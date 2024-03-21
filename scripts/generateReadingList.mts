import fs from 'node:fs';
import stations from '../stations_generated_at_2024-03-20T21:21:31.494Z.json';

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
  datumType?: string
  label: string
  latestReading?: LatestReading
  notation: string
  parameter: string
  parameterName: string
  period?: number
  qualifier: string
  station: string
  stationReference: string
  unit?: string
  unitName: string
  valueType: string
}

interface LatestReading {
  "@id": string
  date: string
  dateTime: string
  measure: string
  value: number
}

type Reading = Pick<Item, 'stationReference' | 'qualifier'> & { readingDate: string, value: number };

const url = 'https://environment.data.gov.uk/flood-monitoring/id/measures?parameter=level';

const fetchData = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json() as Root;

        const validRefsSet = new Set(stations.map(ref => ref.stationReference));

        return data.items
          .filter((item: Item) => item.latestReading && (item.qualifier === 'Stage' || item.qualifier === 'Downstream Stage') && validRefsSet.has(item.stationReference))
          .map((item) => ({
              stationReference: item.stationReference,
              qualifier: item.qualifier,
              readingDate: item.latestReading!.dateTime,
              value: item.latestReading!.value,
          } satisfies Reading));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const generateFilename = () => {
    const timestamp = new Date().toISOString();
    return `./readings_generated_at_${timestamp}.json`;
};

const saveDataToFile = async (data: Reading[]) => {
  const filePath = generateFilename();
  
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error saving data to file:', err);
      throw err;
    } 

    console.log(`💾   Data has been saved to ${filePath}`);
  });
};

const run = async () => {
  const measures = await fetchData();
  if (measures.length === 0) {
    console.log('No measures with a latestReading found or an error occurred.');
    return
  }

  console.log(`✅   Found ${measures.length} measures`);
  await saveDataToFile(measures);
};

run();