import type { OverheadPass } from "../types/satellite";

export interface SatelliteListProps {
    passes: OverheadPass[],
}

export const SatelliteList = ({ passes }: SatelliteListProps) => {
    if (passes.length === 0) {
        return (
            <div>
                <p> No satellites currently overhead</p>
            </div>
        );
    }

    return (
        <>
        <ul>
            {passes.map(pass => (
                <li key={pass.name}> 
                    <div>{pass.name}</div>
                    <div>
                        <span>Elevation: {pass.elevation.toFixed(1)}° </span>
                        <span>Azimuth: {pass.azimuth.toFixed(1)}° </span>
                        <span>Altitude: {pass.alt.toFixed(1)} km </span>
                        <span>Range: {pass.rangeSat.toFixed(1)} km </span>
                    </div>
                    <div>
                        {pass.lat.toFixed(3)}°, {pass.lng.toFixed(3)}°
                    </div>
                </li>
            ))}
        </ul>
        </>
    )
}