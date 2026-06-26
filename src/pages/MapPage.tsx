import { SkyMap, type SkyMapProps } from "../components/SkyMap";

export const MapPage = (props: SkyMapProps) => {
    return (
        <div
        style={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }
        }>
            <SkyMap passes={props.passes} showNames={props.showNames} />
        </div>
    )
}