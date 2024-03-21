-- Extensions
CREATE EXTENSION postgis;
CREATE EXTENSION timescaledb;

-- CreateTable
CREATE TABLE "station" (
    "station_reference" VARCHAR NOT NULL,
    "town" VARCHAR NOT NULL,
    "river_name" VARCHAR NOT NULL,
    "catchment_name" VARCHAR NOT NULL,
    "datum_offset" DOUBLE PRECISION NOT NULL,
    "date_opened" TIMESTAMP(3) NOT NULL,
    "location" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "station_pkey" PRIMARY KEY ("station_reference")
);

-- CreateTable
CREATE TABLE "reading" (
    "station_reference" VARCHAR NOT NULL,
    "qualifier" VARCHAR NOT NULL,
    "reading_date" TIMESTAMPTZ NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "reading_pkey" PRIMARY KEY ("station_reference","reading_date","qualifier")
);

-- CreateIndex
CREATE INDEX "location_idx" ON "station" USING GIST ("location");

-- CreateIndex
CREATE INDEX "reading_station_reference_idx" ON "reading"("station_reference");

-- AddForeignKey
ALTER TABLE "reading" ADD CONSTRAINT "reading_station_reference_fkey" FOREIGN KEY ("station_reference") REFERENCES "station"("station_reference") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateHyperTable
SELECT create_hypertable('reading', 'reading_date', chunk_time_interval => INTERVAL '1 day');