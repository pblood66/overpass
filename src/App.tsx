import { Route, Routes } from 'react-router-dom';
import './App.css'
import { DebugPage } from './pages/DebugPage';
import { usePosition, type PositionState } from './hooks/usePosition';
import { useSatellites, type SatelliteState } from './hooks/useSatellites';
import type { OverheadPass } from './types/satellite';
import { MapPage } from './pages/MapPage';
import { useMemo } from 'react';
import { useOverheadPass } from './hooks/useOverheadPass';


function App() {
    const position: PositionState = usePosition();
    const observer = useMemo(() => position.location, [
        position.location?.lat,
        position.location?.lng,
        position.location?.alt,
    ])
    const satellites: SatelliteState = useSatellites("/data/sat-data.txt");
    const passes: OverheadPass[] = useOverheadPass(satellites.satellites, observer);

    return (
        <>
            <Routes>
                <Route path="/" element={<MapPage passes={passes} showNames={false} />} />
                <Route path="/debug" element={<DebugPage position={position} satellites={satellites} overheadPasses={passes} />} />
            </Routes>
        </>
    );
}

export default App