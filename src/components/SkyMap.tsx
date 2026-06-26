import { useEffect, useRef, useState } from "react";
import type { OverheadPass } from "../types/satellite";

export interface SkyMapProps {
    passes: OverheadPass[],
    showNames?: boolean,
}

const SIZE = 1000;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 24; // leave margin for labels


const dotRadius = (range: number): number => {
    const MIN_R = 2;
    const MAX_R = 7;
    const MIN_RANGE = 300;
    const MAX_RANGE = 2000;

    const clamped = Math.max(MIN_RANGE, Math.min(MAX_RANGE, range));
    const t = 1 - (clamped - MIN_RANGE) / (MAX_RANGE - MIN_RANGE);
    return MIN_R + t * (MAX_R - MIN_R);
}

const toXY = (elevation: number, azimuth: number): [number, number] => {
    const r = RADIUS * (1 - elevation / 90);
    const angle = (azimuth - 90) * (Math.PI / 180);
    return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)]
}

export const SkyMap = ({ passes, showNames = false }: SkyMapProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hovered, setHovered] = useState<OverheadPass | null>(null);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0 });


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = SIZE * dpr;
        canvas.height = SIZE * dpr;
        canvas.style.width = SIZE + "px";
        canvas.style.height = SIZE + "px";
        ctx.scale(dpr, dpr);

        const isDark = true //window.matchMedia("(prefers-color-scheme: dark)").matches;
        const bg = isDark ? "#1a1b20" : "#f4f3ec";
        const ringColor = isDark ? "#2e303a" : "#e5e4e7";
        const textColor = isDark ? "#6b7280" : "#9ca3af";
        const accentColor = isDark ? "#c9b24b" : "#ffcb3b";
        const dotColor = isDark ? "#f3e460" : "#aa3bff";
        const dotGlow = isDark ? "rgba(199, 139, 83, 0.3)" : "rgba(170,59,255,0.2)";
        const labelColor = isDark ? "#f3f4f6" : "#08060d";

        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, RADIUS + 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(CENTER, CENTER, RADIUS + 20, 0, Math.PI * 2);
        ctx.fill();

        [0, 30, 60, 90].forEach(elev => {
            const r = RADIUS * (1 - elev / 90);
            ctx.beginPath();
            ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 1;
            ctx.setLineDash(elev === 0 ? [] : [4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (elev > 0) {
                ctx.fillStyle = textColor;
                ctx.font = "11px ui-monospace, monospace";
                ctx.fillText(`${elev}°`, CENTER + r + 4, CENTER + 4);
            }
        });
        const cardinals = [
            { label: "N", az: 0 },
            { label: "E", az: 90 },
            { label: "S", az: 180 },
            { label: "W", az: 270 },
        ];

        cardinals.forEach(({ label, az }) => {
            const angle = (az - 90) * (Math.PI / 180);
            const x1 = CENTER + 6 * Math.cos(angle);
            const y1 = CENTER + 6 * Math.sin(angle);
            const x2 = CENTER + (RADIUS + 2) * Math.cos(angle);
            const y2 = CENTER + (RADIUS + 2) * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            const lx = CENTER + (RADIUS + 16) * Math.cos(angle);
            const ly = CENTER + (RADIUS + 16) * Math.sin(angle);
            ctx.fillStyle = label === "N" ? accentColor : textColor;
            ctx.font = label === "N" ? "bold 13px var(--sans)" : "13px var(--sans)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, lx, ly);
        });

        passes.forEach(pass => {
            const [x, y] = toXY(pass.elevation, pass.azimuth);
            const r = dotRadius(pass.rangeSat);
            const isHov = hovered?.name === pass.name;

            // Glow
            ctx.beginPath();
            ctx.arc(x, y, r + 3, 0, Math.PI * 2);
            ctx.fillStyle = isHov ? dotGlow.replace("0.3", "0.5") : dotGlow;
            ctx.fill();

            // Dot
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();

            if (isHov) {
                ctx.beginPath();
                ctx.arc(x, y, r + 3, 0, Math.PI * 2);
                ctx.strokeStyle = dotColor;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Label
            if (showNames) {
                ctx.fillStyle = labelColor;
                ctx.font = "11px ui-monospace, monospace";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                const shortName = pass.name.length > 16 ? pass.name.slice(0, 14) + "…" : pass.name;
                ctx.fillText(shortName, x + r + 5, y);
            }
        });
    }, [passes, hovered]);

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        // console.log(`rect: ${rect.right}`)
        let found: OverheadPass | null = null;
        for (const pass of passes) {
            const [x, y] = toXY(pass.elevation, pass.azimuth);
            const r = dotRadius(pass.rangeSat);
            if (Math.hypot(mx - x, my - y) <= r + 6) {
                found = pass;
                break;
            }
        }
        setHovered(found);
        // console.log(`Client: (${e.clientX}, ${e.clientY})`)
        const x = e.clientX + 17;
        const y = e.clientY + 17;
        // console.log(`Tip: (${x}, ${y})`)

        setTooltip({ x: x, y: y });
    }

    return (
        <div>
            <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)} style={{ cursor: hovered ? "pointer" : "default", borderRadius: "50%", display: "block" }} />
            {hovered && (
                <div style={{
                    position: "absolute",
                    left: tooltip.x,
                    top: tooltip.y,
                    background: "var(--code-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    fontFamily: "var(--mono)",
                    color: "var(--text-h)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                }}
                >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{hovered.name}</div>
                    <div style={{ color: "var(--text)", lineHeight: 1.7 }}>
                        Elevation: {hovered.elevation.toFixed(1)}°<br />
                        Azimuth:&nbsp;&nbsp;{hovered.azimuth.toFixed(1)}°<br />
                        Range:&nbsp;&nbsp;&nbsp;&nbsp;{Math.round(hovered.rangeSat)} km<br />
                        Altitude:&nbsp;&nbsp;{Math.round(hovered.alt)} km
                    </div>
                </div>
            )}
        </div>
    )
};