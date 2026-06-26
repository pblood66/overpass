import type { ObserverLocation } from "../lib/lookAngles";
import { useEffect, useState } from "react";
export interface PositionState { 
    location: ObserverLocation | null,
    error: string | null,
    loading: boolean
}

export const usePosition = (): PositionState => {
    const [state, setState] = useState<PositionState>({
        location: null,
        error: null,
        loading: true
    });

    const location = navigator.geolocation;

    useEffect(() => {
        if (!location) { 
            setState({ location: null, error: "Could not find location", loading: false });
            return;
        }

        const watchId = location.watchPosition(
            (pos) => {
                setState({
                    location: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        alt: (pos.coords.altitude ?? 0) / 1000
                    },
                    error: null,
                    loading: false
                });
            },

            (err) => {
                setState({ location: null, error: err.message, loading: false });
            },
            { enableHighAccuracy: true }
        );
        return () => location.clearWatch(watchId);
    }, []);

    return state;
}
