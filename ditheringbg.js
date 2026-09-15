(function () {
  const canvas = document.getElementById("ditherCanvas");
  if (!canvas) return;
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: false,
  });
  if (!gl) {
    console.warn("WebGL2 not supported");
    return;
  }

  const PIXEL_SIZE = 8.0;

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
        float ps = ${PIXEL_SIZE.toFixed(1)};
        vec2 fc = gl_FragCoord.xy - uResolution*0.5;
        float ar = uResolution.x/uResolution.y;
        vec2 cellCoord = floor(fc/(8.0*ps))*(8.0*ps);
        vec2 uv = (cellCoord/uResolution)*vec2(ar,1.0);
        float feed = fbm(uv, uTime*0.1)*0.5 - 0.65;
        float bayer = Bayer8(fc/ps) - 0.5;
        float bw = step(0.5, feed+bayer);
        float t = (gl_FragCoord.y / uResolution.y);
        vec3 primary = vec3(1.0, 1.0, 1.0);
        vec3 accent  = vec3(1.0,  1.0, 1.0);
        vec3 col = mix(accent, primary, t);
        fragColor = vec4(col, bw);
      }
    `;

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

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  resize();

  const start = performance.now();
  function render() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  render();
})();
