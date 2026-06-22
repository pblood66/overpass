import './App.css'
import { SatelliteList } from './components/SatelliteList';
import { useOverheadPass } from './hooks/UseOverheadPass';
import { usePosition } from './hooks/UsePosition'
import { UseSatellites } from './hooks/UseSatellites'

function App() {
    const { location, error: locationError, loading: locationLoading } = usePosition();
    const { satellites, error: satError, loading: satLoading } = UseSatellites("/data/sat-data.txt");
    const passes = useOverheadPass(satellites, location);

    return (
        <div className="app">
            <header>
                <h1>Satellite Tracker</h1>
            </header>

            <main>
                <section>
                    <div>
                        <span>Your Location</span>
                        {locationLoading && <span>Requesting GPS...</span>}
                        {locationError && <span className="status-value error">{locationError}</span>}
                        {location && (
                            <span className="status-value">
                                {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° @ {location.alt}km
                            </span>
                        )}
                    </div>

                    <div>
                        <span>TLE Data</span>
                        {satLoading && <span>Loading...</span>}
                        {satError && <span>{satError}</span>}
                        {!satLoading && !satError && (
                            <span>{satellites.length} Satellites Loaded</span>
                        )}
                    </div>

                    <div>
                        <span>Overhead Now</span>
                        <span> {passes.length} satellites</span>
                    </div>
                </section>

                <section>
                    <h2>Satellites Above 10° elevation</h2>
                    {!location && !locationLoading && (
                        <p>Enable location access to detect overhead satellites.</p>
                    )}
                    {location && <SatelliteList passes={passes} />}
                </section>
            </main>
        </div>
    );
}

export default App