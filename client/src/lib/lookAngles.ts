import { degreesToRadians, radiansToDegrees, ecfToLookAngles, eciToEcf, gstime, propagate, type SatRec } from "satellite.js";

export interface LookAngles {
    elevation: number,
    azimuth: number, 
    range: number
}

export interface ObserverLocation {
    lat: number, 
    lng: number,
    alt?: number;
}

export const getLookAngles = (satRec: SatRec, observer: ObserverLocation, date: Date = new Date()): LookAngles | null => {
    const state = propagate(satRec, date);
    
    if (!state || !state.position) return null;
    
    const gmst = gstime(date);
    const ecf = eciToEcf(state.position, gmst);

    const observerGd = {
        longitude: degreesToRadians(observer.lng),
        latitude: degreesToRadians(observer.lat),
        height: observer.alt ?? 0
    }

    const angles = ecfToLookAngles(observerGd, ecf);

    return {
        elevation: radiansToDegrees(angles.elevation),
        azimuth: radiansToDegrees(angles.azimuth),
        range: angles.rangeSat
    }
}

export const isOverhead = (angles: LookAngles, minElevation = 10): boolean => {
    return angles !== null && angles.elevation >= minElevation;
}
