import * as THREE from 'three';
import { Shader } from '../scene-manager';

const vertexShader = `
varying vec2 vUv;
varying vec2 pos;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    pos = vec2(position.x, position.y);
}
`;

const fragmentShader = `
      uniform vec3      iResolution;           // viewport resolution (in pixels)
      uniform float     iTime;                 // shader playback time (in seconds)
      varying vec2 vUv;
      varying vec2 pos;

      vec4 background_color = vec4( 0.0, 0.0, 0.0, 1.0 );
      vec4 line_color = vec4( 0.0, 1.0, 1.0, 1.0 );
      float line_freq = 10.0;
      float height = 0.5;
      float speed = 1.4;
      vec2 scale = vec2( -1.0, 12.0 );

      void main()
      {
          vec2 uv = vUv * scale;
          float shift = cos( floor( uv.y ) );
          uv.x += shift;

          float freq = clamp( cos( uv.x * line_freq ) * 3.0, 0.0, 1.0 ) * height;
          float line = 1.0 - clamp( abs( freq - mod( uv.y, 1.0 ) ) * 11.0, 0.0, 1.0 );

          gl_FragColor = mix( background_color, line_color, line * mod( uv.x - iTime * speed * abs( shift ), 1.0 ) /*  * mod( TIME + shift, 1.0 ) */ );
      }
    `;

export const getElectronicShader: () => Shader = () => {
  const uniforms = {
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    iTime: { value: 0 },
  };

  return {
    vertexShader,
    fragmentShader,
    uniforms,
  };
};
