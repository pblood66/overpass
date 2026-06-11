import type { SatRec } from "satellite.js";

export interface SatellitePosition {
    name: string,
    satrec: SatRec,
    lat: number,
    lng: number, 
    alt: number,
    elevation: number,
    azimuth: number
}

export interface TLERecord {
    name: string,
    line1: string, 
    line2: string
}
