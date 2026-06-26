import { SatelliteList } from "../components/SatelliteList";
import type { PositionState } from "../hooks/usePosition";
import type { SatelliteState } from "../hooks/useSatellites";
import type { OverheadPass } from "../types/satellite";

export interface DebugProps {
    position: PositionState,
    satellites: SatelliteState,
    overheadPasses: OverheadPass[]
}

export const DebugPage = (props: DebugProps) => {
    const { location, error: locationError, loading: locationLoading } = props.position;
    const { satellites, error: satError, loading: satLoading } = props.satellites;
    const passes = props.overheadPasses;

    return (
        <div className="app">
            <header>
                <h1>Debug</h1>
            </header>

            <main>
                <section>
                    <div>
                        <span>Your Location: </span>
                        {locationLoading && <span>Requesting GPS...</span>}
                        {locationError && <span className="status-value error">{locationError}</span>}
                        {location && (
                            <span className="status-value">
                                {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° @ {location.alt}km
                            </span>
                        )}
                    </div>

                    <div>
                        <span>TLE Data: </span>
                        {satLoading && <span>Loading...</span>}
                        {satError && <span>{satError}</span>}
                        {!satLoading && !satError && (
                            <span>{satellites.length} Satellites Loaded</span>
                        )}
                    </div>

                    <div>
                        <span>Overhead Now: </span>
                        <span> {passes.length} satellites</span>
                    </div>
                </section>

                <section>
                    <h2>Satellites Above 50° elevation</h2>
                    {!location && !locationLoading && (
                        <p>Enable location access to detect overhead satellites.</p>
                    )}
                    {location && <SatelliteList passes={passes} />}
                </section>
            </main>
        </div>
    );
}