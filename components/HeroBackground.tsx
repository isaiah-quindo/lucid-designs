'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Transform, Vec2 } from 'ogl'

const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uTime;
  uniform float uMouseStrength;
  uniform float uGridScale;

  // Simplex noise (Ashima)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian motion — layered noise
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);

    // Halftone grid in normal screen-space
    float gridScale = uGridScale;
    vec2 grid = p * gridScale;
    vec2 cellCenter = floor(grid) + 0.5;
    vec2 cellOffset = grid - cellCenter;

    // Sample intensity at the cell center so every pixel of one dot is the same size
    vec2 sampleP = cellCenter / gridScale;
    vec2 sampleUv = vec2(sampleP.x / aspect, sampleP.y);

    // Cursor repulsion — shift the wave-sample position radially OUTWARD from the cursor.
    // The influence zone stretches behind the cursor's motion so a moving pointer leaves a comet trail.
    vec2 toAway = sampleP - m;
    float dd = length(toAway);
    vec2 dir = toAway / max(dd, 0.0001);

    // Trail anisotropy — points "behind" the cursor (opposite the velocity vector) feel
    // closer to it, elongating the repulsion zone into a trail.
    float vSpeed = length(uVelocity);
    vec2 vDir = vSpeed > 0.001 ? uVelocity / vSpeed : vec2(0.0);
    float behind = max(0.0, -dot(dir, vDir));        // 1 directly behind, 0 ahead/perpendicular
    float trailBoost = 1.0 + behind * min(vSpeed, 1.5) * 2.4;
    float effectiveDist = dd / trailBoost;

    float repulseRange = 0.34;
    float repulseStrength = smoothstep(repulseRange, 0.0, effectiveDist) * uMouseStrength;
    vec2 waveSample = sampleP + dir * repulseStrength * 0.18;

    // Wave field — overlaid sine waves at different angles produce rolling, interfering crests
    float w1 = sin(waveSample.x * 5.5 + uTime * 0.18);
    float w2 = sin(waveSample.y * 4.2 - uTime * 0.14);
    float w3 = sin((waveSample.x * 0.7 + waveSample.y * 1.1) * 5.0 + uTime * 0.20);
    float w4 = sin((waveSample.x * 1.3 - waveSample.y * 0.6) * 3.6 - uTime * 0.10);
    float waves = (w1 + w2 + w3 + w4) * 0.25;
    waves = waves * 0.5 + 0.5;

    // Threshold so only the wave crests carry dots — troughs become bare patches
    float crests = smoothstep(0.48, 0.78, waves);

    float radiusC = length((sampleUv - 0.5) * vec2(aspect, 1.0));
    float radialMaskC = 1.0 - smoothstep(0.65, 1.25, radiusC);

    // Smooth void at the very centre of the repulsion field — also stretched by trailBoost
    // so the empty area follows the cursor's motion.
    float voidMask = smoothstep(0.0, 0.12, effectiveDist);
    voidMask = mix(1.0, voidMask, uMouseStrength);

    float cellIntensity = clamp(crests * radialMaskC * voidMask, 0.0, 1.0);

    float dotRadius = cellIntensity * 0.40;

    // Anti-aliased dot
    float distToCenter = length(cellOffset);
    float aa = max(gridScale / uResolution.x, 0.6 / 100.0) * 1.2;
    float dotMask = 1.0 - smoothstep(dotRadius - aa, dotRadius + aa, distToCenter);

    // Output — muted neutral-gray threads so the headline reads clearly above them
    vec3 dotColor = vec3(0.38, 0.38, 0.39);
    vec3 col = dotColor * dotMask;

    // Subtle film grain so flat dark areas don't band
    float grain = (fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.01;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function HeroBackground({
  gridScale = 220,
}: {
  gridScale?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Respect reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)
    gl.canvas.style.opacity = '0'
    gl.canvas.style.transition = 'opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1)'
    container.appendChild(gl.canvas)
    // Trigger the fade after two animation frames so the canvas has rendered at least once
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        gl.canvas.style.opacity = '1'
      })
    )

    const geometry = new Triangle(gl)

    const mouseTarget = new Vec2(0.5, 0.5)
    const mouseCurrent = new Vec2(0.5, 0.5)
    const mouseLast = new Vec2(0.5, 0.5)
    const velocity = new Vec2(0, 0)
    let strengthTarget = 0
    let strengthCurrent = 0

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uResolution: { value: new Vec2(1, 1) },
        uMouse: { value: mouseCurrent },
        uVelocity: { value: velocity },
        uTime: { value: 0 },
        uMouseStrength: { value: 0 },
        uGridScale: { value: gridScale },
      },
    })

    const scene = new Transform()
    const mesh = new Mesh(gl, { geometry, program })
    mesh.setParent(scene)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value.set(w, h)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      mouseTarget.set(x, y)
      strengthTarget = 1
    }
    const onLeave = () => {
      strengthTarget = 0
    }

    window.addEventListener('pointermove', onMove)
    container.addEventListener('pointerleave', onLeave)

    const start = performance.now()
    let rafId = 0

    const loop = () => {
      const t = (performance.now() - start) / 1000

      // smooth lerp toward the target mouse position
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06
      strengthCurrent += (strengthTarget - strengthCurrent) * 0.05

      // Per-frame velocity from the smoothed cursor — drives the trail anisotropy in the shader.
      // We low-pass the instantaneous delta, then decay each frame so motion dies when the cursor stops.
      const vx = (mouseCurrent.x - mouseLast.x) * 30
      const vy = (mouseCurrent.y - mouseLast.y) * 30
      velocity.x += (vx - velocity.x) * 0.2
      velocity.y += (vy - velocity.y) * 0.2
      velocity.x *= 0.93
      velocity.y *= 0.93
      mouseLast.x = mouseCurrent.x
      mouseLast.y = mouseCurrent.y

      program.uniforms.uTime.value = reduced ? 0 : t
      program.uniforms.uMouseStrength.value = strengthCurrent

      renderer.render({ scene })
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
      gl.canvas.parentNode?.removeChild(gl.canvas)
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 bg-ink"
    />
  )
}
