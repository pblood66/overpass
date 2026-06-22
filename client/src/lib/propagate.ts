import { degreesLat, degreesLong, eciToGeodetic, gstime, propagate, type SatRec } from "satellite.js"

export interface SatellitePosition {
    lat: number,
    lng: number,
    alt: number
}

export const getPosition = (satRec: SatRec, date: Date = new Date()): SatellitePosition | null => {
    const state = propagate(satRec, date);

    if (!state || !state.position || typeof state.position === 'boolean') return null;

    const gmst = gstime(date);
    const geo = eciToGeodetic(state.position, gmst);

    return {
        lat: degreesLat(geo.latitude),
        lng: degreesLong(geo.longitude),
        alt: geo.height
    }
}
