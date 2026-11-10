"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { palette } from "@/lib/themes";
import { WORLD_DOTS } from "@/data/worldDots";
import {
  STAGE_CENTER_Y,
  INTERACTIVE_UNTIL,
  TIMELINE,
  smoothstep,
} from "./storyTimeline";

type City = {
  code: string;
  name: string;
  lon: number;
  lat: number;
  home?: boolean;
  // crowded spots only show their label on hover, so the map doesn't turn into a word cloud
  minor?: boolean;
};

const CITIES: City[] = [
  { code: "DED", name: "Dehradun", lon: 78.03, lat: 30.32, home: true },
  { code: "DXB", name: "Dubai", lon: 55.27, lat: 25.2 },
  { code: "LON", name: "London", lon: -0.13, lat: 51.51 },
  { code: "FRA", name: "Frankfurt", lon: 8.68, lat: 50.11 },
  { code: "NYC", name: "New York", lon: -74.0, lat: 40.71 },
  { code: "SFO", name: "San Francisco", lon: -122.42, lat: 37.77 },
  { code: "GRU", name: "São Paulo", lon: -46.63, lat: -23.55 },
  { code: "LOS", name: "Lagos", lon: 3.38, lat: 6.52 },
  { code: "SIN", name: "Singapore", lon: 103.82, lat: 1.35 },
  { code: "HKG", name: "Hong Kong", lon: 114.17, lat: 22.32 },
  { code: "SYD", name: "Sydney", lon: 151.21, lat: -33.87 },
  { code: "YYZ", name: "Toronto", lon: -79.38, lat: 43.65, minor: true },
  { code: "MEX", name: "Mexico City", lon: -99.13, lat: 19.43 },
  { code: "BOG", name: "Bogotá", lon: -74.07, lat: 4.71, minor: true },
  { code: "EZE", name: "Buenos Aires", lon: -58.38, lat: -34.6 },
  { code: "PAR", name: "Paris", lon: 2.35, lat: 48.86, minor: true },
  { code: "ZRH", name: "Zurich", lon: 8.54, lat: 47.37, minor: true },
  { code: "IST", name: "Istanbul", lon: 28.98, lat: 41.01 },
  { code: "CAI", name: "Cairo", lon: 31.24, lat: 30.04, minor: true },
  { code: "RUH", name: "Riyadh", lon: 46.68, lat: 24.71, minor: true },
  { code: "NBO", name: "Nairobi", lon: 36.82, lat: -1.29 },
  { code: "JNB", name: "Johannesburg", lon: 28.05, lat: -26.2 },
  { code: "BOM", name: "Mumbai", lon: 72.88, lat: 19.08 },
  { code: "BLR", name: "Bengaluru", lon: 77.59, lat: 12.97, minor: true },
  { code: "BKK", name: "Bangkok", lon: 100.5, lat: 13.76, minor: true },
  { code: "CGK", name: "Jakarta", lon: 106.85, lat: -6.2, minor: true },
  { code: "SHA", name: "Shanghai", lon: 121.47, lat: 31.23, minor: true },
  { code: "SEL", name: "Seoul", lon: 126.98, lat: 37.57, minor: true },
  { code: "TYO", name: "Tokyo", lon: 139.69, lat: 35.69 },
  { code: "AKL", name: "Auckland", lon: 174.76, lat: -36.85 },
];

// the one request the scroll story follows
const HOME = CITIES[0];
const DUBAI = CITIES[1];

// what a request reports when it lands
const RESPONSES = ["GET 200", "POST 201", "GET 304", "PUT 200", "GET 200"];

type Packet = {
  from: City;
  to: City;
  t: number;
  speed: number;
};

type Landing = {
  city: City;
  label: string;
  age: number;
};

type Camera = {
  lon: number;
  lat: number;
  zoom: number;
  // vertical position of the camera centre, as a share of the canvas height
  centerY: number;
};

// read on every draw so a palette switch shows up immediately
const accent = () => palette.current.signal.join(", ");
const text = () => palette.current.mist[0].join(", ");
const MAX_PACKETS = 7;
const LANDING_LIFE = 70;

const { step, latTop, latBottom, rows } = WORLD_DOTS;

// land dots as flat [lon, lat, lon, lat, ...] so the per-frame loop stays tight
const LAND = (() => {
  const points: number[] = [];
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "1") points.push(-180 + step / 2 + c * step, latTop - r * step);
    }
  });
  return new Float32Array(points);
})();

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const cameraAt = (p: number, small: boolean): Camera => {
  const world = { lon: small ? 40 : 0, lat: 12, zoom: small ? 1.7 : 1 };
  const region = { lon: 67, lat: 27, zoom: small ? 4.5 : 3.2 };
  const zoomIn = smoothstep(TIMELINE.zoomIn[0], TIMELINE.zoomIn[1], p);
  const dive = smoothstep(TIMELINE.dive[0], TIMELINE.dive[1], p);

  return {
    lon: lerp(lerp(world.lon, region.lon, zoomIn), HOME.lon, dive),
    lat: lerp(lerp(world.lat, region.lat, zoomIn), HOME.lat, dive),
    // zoom in log space so each step of scroll feels like the same amount of zoom
    zoom: Math.exp(
      lerp(
        lerp(Math.log(world.zoom), Math.log(region.zoom), zoomIn),
        Math.log(24),
        dive
      )
    ),
    centerY: lerp(0.5, STAGE_CENTER_Y, dive),
  };
};

type RequestMapProps = {
  // scroll progress of the story; without it the map stays on the world view
  progress?: MotionValue<number>;
  className?: string;
};

const RequestMap = ({ progress, className }: RequestMapProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // next/font gives the mono font a generated name, so read it back from the element
    const monoFont = getComputedStyle(canvas).fontFamily;

    let width = 0;
    let height = 0;
    let camera = cameraAt(0, false);
    let packets: Packet[] = [];
    let landings: Landing[] = [];
    let hovered: City | null = null;
    let interactive = true;
    let frame = 0;
    let tick = 0;
    let visible = true;

    // pixels per degree when the whole world fits
    const baseScale = () => Math.min(width / 360, height / (latTop - latBottom));

    const project = (lon: number, lat: number) => {
      const scale = baseScale() * camera.zoom;
      return {
        x: width / 2 + (lon - camera.lon) * scale,
        y: height * camera.centerY - (lat - camera.lat) * scale,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      height = wrap.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) draw(0);
    };

    // routes bow upward like flight paths, more for longer distances
    const pointOnRoute = (from: City, to: City, t: number) => {
      const a = project(from.lon, from.lat);
      const b = project(to.lon, to.lat);
      const lift = Math.hypot(b.x - a.x, b.y - a.y) * 0.32;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2 - lift;
      const u = 1 - t;
      return {
        x: u * u * a.x + 2 * u * t * cx + t * t * b.x,
        y: u * u * a.y + 2 * u * t * cy + t * t * b.y,
      };
    };

    const strokeRoute = (from: City, to: City, t0: number, t1: number) => {
      const segments = 32;
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const point = pointOnRoute(from, to, t0 + ((t1 - t0) * i) / segments);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    };

    const drawPacket = (from: City, to: City, t: number, alpha: number) => {
      ctx.strokeStyle = `rgba(${accent()}, ${0.18 * alpha})`;
      ctx.lineWidth = 1;
      strokeRoute(from, to, 0, 1);

      ctx.strokeStyle = `rgba(${accent()}, ${0.95 * alpha})`;
      ctx.lineWidth = 1.8;
      strokeRoute(from, to, Math.max(0, t - 0.22), t);

      const head = pointOnRoute(from, to, t);
      ctx.fillStyle = `rgba(${text()}, ${alpha})`;
      ctx.shadowColor = `rgba(${accent()}, 0.9)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawRing = (
      city: City,
      label: string,
      progress: number,
      alpha: number
    ) => {
      const { x, y } = project(city.lon, city.lat);
      ctx.strokeStyle = `rgba(${accent()}, ${(1 - progress) * 0.8 * alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, 3 + progress * 22, 0, Math.PI * 2);
      ctx.stroke();

      // the response code floats up from the city
      ctx.fillStyle = `rgba(${text()}, ${(1 - progress) * alpha})`;
      ctx.fillText(label, x, y + 20 - progress * 10);
    };

    const draw = (p: number) => {
      const small = width < 640;
      camera = cameraAt(p, small);
      const mapAlpha = 1 - smoothstep(TIMELINE.mapFade[0], TIMELINE.mapFade[1], p);
      // the ambient traffic and the other cities step aside once the story starts
      const ambientAlpha = 1 - smoothstep(0.03, 0.14, p);

      ctx.clearRect(0, 0, width, height);
      if (mapAlpha <= 0) return;
      ctx.globalAlpha = mapAlpha;

      // all land dots go into one path so the whole map is a single fill
      const scale = baseScale() * camera.zoom;
      const radius = Math.max(0.7, baseScale() * step * 0.2) * Math.pow(camera.zoom, 0.7);
      ctx.fillStyle = `rgba(${text()}, 0.3)`;
      ctx.beginPath();
      for (let i = 0; i < LAND.length; i += 2) {
        const x = width / 2 + (LAND[i] - camera.lon) * scale;
        const y = height * camera.centerY - (LAND[i + 1] - camera.lat) * scale;
        if (x < -radius || x > width + radius || y < -radius || y > height + radius) continue;
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.lineCap = "round";
      if (ambientAlpha > 0) {
        for (const packet of packets) {
          drawPacket(packet.from, packet.to, packet.t, ambientAlpha);
        }
      }

      const route = smoothstep(TIMELINE.route[0], TIMELINE.route[1], p);
      if (route > 0 && route < 1) drawPacket(DUBAI, HOME, route, 1);

      ctx.font = `${small ? 8 : 10}px ${monoFont}`;
      ctx.textAlign = "center";

      for (const city of CITIES) {
        const inStory = city === HOME || city === DUBAI;
        const alpha = inStory ? 1 : 1 - smoothstep(0.08, 0.2, p);
        if (alpha <= 0) continue;
        const { x, y } = project(city.lon, city.lat);
        const active = city === hovered || city.home;
        ctx.fillStyle = `rgba(${accent()}, ${(active ? 1 : 0.85) * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, active ? 3.5 : city.minor ? 2 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        if ((!small && !city.minor) || active || (inStory && p > 0.1)) {
          ctx.fillStyle = active
            ? `rgba(${accent()}, ${alpha})`
            : `rgba(${text()}, ${0.55 * alpha})`;
          const label =
            city === hovered ? city.name : city.home ? `${city.code} · home` : city.code;
          ctx.fillText(label, x, y - 10);
        }
      }

      for (const landing of landings) {
        drawRing(landing.city, landing.label, landing.age / LANDING_LIFE, ambientAlpha);
      }
      const landed = smoothstep(TIMELINE.landing[0], TIMELINE.landing[1], p);
      if (landed > 0 && landed < 1) drawRing(HOME, "GET 200", landed, 1);

      ctx.globalAlpha = 1;
    };

    const send = (from: City) => {
      const others = CITIES.filter((city) => city !== from);
      packets.push({
        from,
        to: others[Math.floor(Math.random() * others.length)],
        t: 0,
        speed: 0.008 + Math.random() * 0.006,
      });
    };

    const update = (p: number) => {
      tick++;
      if (p < 0.06 && tick % 50 === 1 && packets.length < MAX_PACKETS) {
        send(CITIES[Math.floor(Math.random() * CITIES.length)]);
      }

      packets = packets.filter((packet) => {
        packet.t = Math.min(1, packet.t + packet.speed);
        if (packet.t < 1) return true;
        landings.push({
          city: packet.to,
          label: RESPONSES[Math.floor(Math.random() * RESPONSES.length)],
          age: 0,
        });
        return false;
      });

      landings = landings
        .map((landing) => ({ ...landing, age: landing.age + 1 }))
        .filter((landing) => landing.age < LANDING_LIFE);

      // only advertise the "Send" cursor while clicking actually sends something
      const nowInteractive = p < INTERACTIVE_UNTIL;
      if (nowInteractive !== interactive) {
        interactive = nowInteractive;
        if (interactive) canvas.dataset.cursor = "Send";
        else delete canvas.dataset.cursor;
        if (!interactive) hovered = null;
      }
    };

    const loop = () => {
      const p = progress?.get() ?? 0;
      update(p);
      draw(p);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const cityNear = (clientX: number, clientY: number, range: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let best: City | null = null;
      let bestDist = range;
      for (const city of CITIES) {
        const point = project(city.lon, city.lat);
        const dist = Math.hypot(point.x - x, point.y - y);
        if (dist < bestDist) {
          best = city;
          bestDist = dist;
        }
      }
      return best;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (interactive) hovered = cityNear(e.clientX, e.clientY, 22);
    };

    const handlePointerLeave = () => {
      hovered = null;
    };

    // clicking sends a request from the nearest city; clicking right on a city sends two
    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      const origin = cityNear(e.clientX, e.clientY, Infinity);
      if (!origin) return;
      send(origin);
      if (origin === hovered) send(origin);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    resize();

    if (reduceMotion) {
      // a few finished routes, drawn once
      packets = [
        { from: DUBAI, to: HOME, t: 1, speed: 0 },
        { from: DUBAI, to: CITIES[2], t: 1, speed: 0 },
        { from: CITIES[4], to: CITIES[2], t: 1, speed: 0 },
        { from: HOME, to: CITIES[8], t: 1, speed: 0 },
      ];
      draw(0);
      return () => resizeObserver.disconnect();
    }

    canvas.dataset.cursor = "Send";

    // stop animating while the map is off screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(wrap);

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", start);
    };
  }, [progress]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-[2.6/1] w-full", className)}
    >
      <canvas
        ref={canvasRef}
        aria-label="World map with simulated web requests between cities. Click to send one."
        role="img"
        className="absolute inset-0 h-full w-full font-code"
      />
    </div>
  );
};

export default RequestMap;
