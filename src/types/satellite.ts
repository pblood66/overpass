import type { SatellitePosition } from "../lib/propagate";
import type { TLERecord } from "../lib/parseTLE";
import type { LookAngles } from "satellite.js";

export interface SatelliteWithPosition extends TLERecord, SatellitePosition {};
export interface OverheadPass extends SatelliteWithPosition, LookAngles {};
