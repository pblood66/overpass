import { twoline2satrec, type SatRec } from "satellite.js";

export const parseTLE = (raw: string): SatRec[] => {
    const sats: SatRec[] = [];
    const data = raw.split("\n").filter(Boolean)

    for (let i = 0; i < data.length; i += 3) {
        const line1 = data[i + 1];
        const line2 = data[i + 2];

        if (!line1.startsWith('1') || !line2.startsWith('2')) continue;

        sats.push(twoline2satrec(line1, line2));
    }

    return sats;
} 


