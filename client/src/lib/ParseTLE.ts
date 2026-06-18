import { twoline2satrec, type SatRec } from "satellite.js";

export interface TLERecord {
    name: string, 
    line1: string, 
    line2: string,
    satrec: SatRec
}

export const parseTLE = (raw: string): TLERecord[] => {
    const sats: TLERecord[] = [];
    const data = raw.split("\n").filter(Boolean)

    for (let i = 0; i < data.length; i += 3) {
        const name = data[i];
        const line1 = data[i + 1];
        const line2 = data[i + 2];

        if (!name || !line1 || !line2) continue;
        if (line1.length != 69 || line2.length != 69) continue;
        if (!line1.startsWith('1') || !line2.startsWith('2')) continue;

        sats.push({name, line1, line2, satrec: twoline2satrec(line1, line2)});
    }

    return sats;
} 


