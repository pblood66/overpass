import { degreesToRadians, ecfToLookAngles, eciToEcf, gstime, propagate, radiansToDegrees, twoline2satrec } from "satellite.js";

const line1 = '1 25544U 98067A   26158.90128688  .00007994  00000+0  14961-3 0  9996',
    line2 = '2 25544  51.6338 346.0598 0006926 145.2709 214.8733 15.49660544570312';

const satrec = twoline2satrec(line1, line2);

console.log(satrec.satnum);

const state = propagate(satrec, new Date());

if (state == null) {
    throw Error("propogation failed");
}

const gmst = gstime(new Date());

// ECI -> ECF -> Look Angles
const observerGeodetic = {
    longitude: degreesToRadians(-111.648288),
    latitude: degreesToRadians(40.246498),
    height: 1.387
}

const positionECF = eciToEcf(state.position, gmst);
const {azimuth, elevation, rangeSat} = ecfToLookAngles(observerGeodetic, positionECF)

console.log(`Azimuth: ${radiansToDegrees(azimuth)} degrees`)
console.log(`elevation: ${radiansToDegrees(elevation)} degrees`)
console.log(`rangeSat: ${rangeSat} km`)
