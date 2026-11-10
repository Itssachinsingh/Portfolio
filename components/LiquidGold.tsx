"use client";

import { useEffect, useRef } from "react";

import { palette } from "@/lib/themes";

const VERTEX = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uClock;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uScroll;
uniform vec3 uRipples[4];
uniform vec3 uInk;
uniform vec3 uShine;

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = rot * p;
    amp *= 0.5;
  }
  return value;
}

// noise fed back into itself (domain warping) gives the slow folds of molten metal
float liquid(vec2 p) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, uTime * 0.04)),
    fbm(p + vec2(5.2, 1.3) - uTime * 0.03)
  );
  return fbm(p + 2.6 * q + vec2(uTime * 0.02, 0.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

  // the cursor presses a dent into the surface
  vec2 toMouse = p - mouse;
  float md = length(toMouse);
  p += toMouse / max(md, 1e-4) * exp(-md * md * 14.0) * 0.07 * uMouseStrength;

  // clicks send rings out across the surface
  for (int i = 0; i < 4; i++) {
    vec3 r = uRipples[i];
    if (r.z < 0.0) continue;
    float age = uClock - r.z;
    vec2 rd = p - vec2(r.x * aspect, r.y);
    float rl = length(rd);
    float front = rl - age * 0.55;
    float ring = sin(front * 38.0) * exp(-age * 1.6) * exp(-abs(front) * 10.0);
    p += rd / max(rl, 1e-4) * ring * 0.025;
  }

  p.y -= uScroll;
  vec2 sp = p * 1.4;
  float h = liquid(sp);

  // slope towards a light in the top-left gives the metal its sheen
  float e = 0.015;
  float slope = (liquid(sp + vec2(-0.7, 0.7) * e) - h) / e;
  float light = clamp(0.5 + slope * 0.35, 0.0, 1.0);
  float spec = pow(light, 8.0);
  float body = smoothstep(0.3, 0.8, h);

  // a deep tone of the accent for the body, the accent itself for highlights
  vec3 deep = uShine * vec3(0.32, 0.27, 0.19);
  vec3 col = uInk + deep * body * 0.22 + uShine * spec * body * 0.45;
  col += uShine * exp(-md * md * 9.0) * 0.05 * uMouseStrength;

  float vignette = smoothstep(1.25, 0.2, length(uv - 0.5) * 1.5);
  col *= mix(0.6, 1.0, vignette);

  // a touch of noise stops the dark gradients from banding
  col += (hash(gl_FragCoord.xy + fract(uClock)) - 0.5) * (2.0 / 255.0);
  outColor = vec4(col, 1.0);
}`;

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const LiquidGold = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    // without WebGL2 the page keeps its CSS gradient background
    if (!canvas || !gl) {
      if (canvas) canvas.style.display = "none";
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      canvas.style.display = "none";
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);

    // one oversized triangle covers the whole screen
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uRes = uniform("uRes");
    const uTime = uniform("uTime");
    const uClock = uniform("uClock");
    const uMouse = uniform("uMouse");
    const uMouseStrength = uniform("uMouseStrength");
    const uScroll = uniform("uScroll");
    const uRipples = uniform("uRipples");
    const uInk = uniform("uInk");
    const uShine = uniform("uShine");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let strength = 0;
    let strengthTarget = 0;
    let time = 0;
    let clock = 0;
    let scroll = 0;
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    let last = performance.now();
    let frame = 0;
    // x, y, start time per ripple; a negative start marks an empty slot
    const ripples = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]);
    let nextRipple = 0;

    const resize = () => {
      // the surface is soft, so rendering at half resolution costs nothing visible
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uClock, clock);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseStrength, strength);
      gl.uniform1f(uScroll, scroll);
      gl.uniform3fv(uRipples, ripples);
      const { ink, signal } = palette.current;
      gl.uniform3f(uInk, ink[0][0] / 255, ink[0][1] / 255, ink[0][2] / 255);
      gl.uniform3f(uShine, signal[0] / 255, signal[1] / 255, signal[2] / 255);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      // scrolling speeds the flow up for a moment
      time += dt * (1 + scrollBoost * 4);
      scrollBoost *= 0.93;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      strength += (strengthTarget - strength) * 0.05;
      scroll += ((window.scrollY / window.innerHeight) * 0.25 - scroll) * 0.08;

      render();
      frame = requestAnimationFrame(loop);
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1 - e.clientY / window.innerHeight;
      strengthTarget = 1;
    };

    const handlePointerLeave = () => {
      strengthTarget = 0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const slot = (nextRipple++ % 4) * 3;
      ripples[slot] = e.clientX / window.innerWidth;
      ripples[slot + 1] = 1 - e.clientY / window.innerHeight;
      ripples[slot + 2] = clock;
    };

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(1, scrollBoost + delta / 500);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
    };

    resize();
    canvas.addEventListener("webglcontextlost", handleContextLost);

    if (reduceMotion) {
      // one still frame, redrawn only when the window changes size
      const redraw = () => {
        resize();
        render();
      };
      render();
      window.addEventListener("resize", redraw);
      window.addEventListener("themechange", redraw);
      return () => {
        window.removeEventListener("resize", redraw);
        window.removeEventListener("themechange", redraw);
        canvas.removeEventListener("webglcontextlost", handleContextLost);
      };
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
};

export default LiquidGold;
