import { useEffect, useRef } from "react";
import { useTheme } from "../theme.jsx";

// every 8x8 block on screen is one solid color, so we draw one canvas pixel
// per block and let css scale it up (64x less work for the gpu)
const PIXEL_SIZE = 8;

const vsSource = `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

const fsSource = `#version 300 es
      precision highp float;
      uniform vec2  uResolution;
      uniform float uTime;
      uniform vec3  uColor;
      out vec4 fragColor;

      float Bayer2(vec2 a) {
        a = floor(a);
        return fract(a.x / 2.0 + a.y * a.y * 0.75);
      }
      float Bayer4(vec2 a) { return Bayer2(0.5*a)*0.25 + Bayer2(a); }
      float Bayer8(vec2 a) { return Bayer4(0.5*a)*0.25 + Bayer2(a); }

      float hash11(float n) { return fract(sin(n)*43758.5453); }

      float vnoise(vec3 p) {
        vec3 ip = floor(p), fp = fract(p);
        float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113)));
        float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));
        float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113)));
        float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));
        float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113)));
        float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));
        float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113)));
        float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));
        vec3 w=fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
        return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),
                   mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z)*2.0-1.0;
      }

      float fbm(vec2 uv, float t) {
        vec3 p = vec3(uv*4.0, t);
        float s=1.0, f=1.0, sum=1.0;
        for(int i=0;i<5;i++){sum+=s*vnoise(p*f);f*=1.25;s*=1.0;}
        return sum*0.5+0.5;
      }

      void main() {
        // 1 canvas pixel = 1 block, so no pixel size math needed here
        vec2 fc = gl_FragCoord.xy - uResolution*0.5;
        float ar = uResolution.x/uResolution.y;
        vec2 cellCoord = floor(fc/8.0)*8.0;
        vec2 uv = (cellCoord/uResolution)*vec2(ar,1.0);
        float feed = fbm(uv, uTime*0.1)*0.5 - 0.65;
        float bayer = Bayer8(fc) - 0.5;
        float bw = step(0.5, feed+bayer);
        fragColor = vec4(uColor, bw);
      }
    `;

const COLORS = {
  light: [1.0, 0.0, 0.467],
  dark: [1.0, 1.0, 1.0],
};

export default function DitherBackground() {
  const canvasRef = useRef(null);
  const setColorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      console.warn("WebGL2 not supported");
      return;
    }

    function compileShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uColor = gl.getUniformLocation(prog, "uColor");

    // lets the theme effect below recolor without restarting everything
    setColorRef.current = (name) => gl.uniform3f(uColor, ...COLORS[name]);
    setColorRef.current(document.documentElement.classList.contains("light-mode") ? "light" : "dark");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      canvas.width = Math.ceil(window.innerWidth / PIXEL_SIZE);
      canvas.height = Math.ceil(window.innerHeight / PIXEL_SIZE);
      // exact 8x scale keeps every block the same size (can poke past the edge a bit)
      canvas.style.width = canvas.width * PIXEL_SIZE + "px";
      canvas.style.height = canvas.height * PIXEL_SIZE + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame;
    function render() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    }
    render();

    // stop animating when you leave the page
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      setColorRef.current = null;
    };
  }, []);

  useEffect(() => {
    setColorRef.current?.(theme);
  }, [theme]);

  return <canvas id="ditherCanvas" ref={canvasRef} />;
}
