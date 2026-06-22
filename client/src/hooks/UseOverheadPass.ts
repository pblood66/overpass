import { useEffect, useState } from "react"
import type { TLERecord } from "../lib/parseTLE"
import type { OverheadPass } from "../types/satellite"
import { getLookAngles, type ObserverLocation } from "../lib/lookAngles"
import { getPosition } from "../lib/propagate"

const MIN_ELEVATION_DEG = 10;
const REFRESH_INTERVAL = 5000;

export const useOverheadPass = (satellites: TLERecord[], observer: ObserverLocation | null) : OverheadPass[] => {
   const [passes, setPasses] = useState<OverheadPass[]>([]); 

   useEffect(() => {
       if (!observer || satellites.length === 0) {
           setPasses([]);
           return;
       }

       const compute = () => {
           const now = new Date();
           const overhead: OverheadPass[] = [];

           for (const sat of satellites) {
               const position = getPosition(sat.satrec, now);
               if (!position) continue;

               const angles = getLookAngles(sat.satrec, observer!, now);
               if (!angles || angles.elevation < MIN_ELEVATION_DEG) continue;

               overhead.push({
                   ...sat,
                   ...position,
                   ...angles,
               });
           }

           overhead.sort((a, b) => b.elevation - a.elevation);
           setPasses(overhead);
       }

       compute();
       const interval = setInterval(compute, REFRESH_INTERVAL);
       return () => clearInterval(interval);
   }, [satellites, observer]);
   
   return passes;
}
