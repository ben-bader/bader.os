import * as THREE from 'three'
import type { CapabilityLevel } from '@/lib/experience/capabilities'

export function createEngineeringGlass(level: CapabilityLevel) {
  const high = level === 'high'
  const medium = level === 'medium'
  const material = new THREE.MeshPhysicalMaterial({
    color: '#C5DEC0',
    metalness: 0.08,
    roughness: high ? 0.2 : medium ? 0.26 : 0.34,
    transmission: high ? 0.62 : medium ? 0.32 : 0,
    thickness: high ? 0.85 : medium ? 0.6 : 0,
    ior: 1.32,
    clearcoat: high ? 0.92 : medium ? 0.7 : 0.42,
    clearcoatRoughness: high ? 0.14 : medium ? 0.22 : 0.3,
    attenuationColor: new THREE.Color('#6A8B71'),
    attenuationDistance: 2.4,
    transparent: false,
    opacity: 1,
  })

  material.onBeforeCompile = shader => {
    shader.uniforms.uPointerDirection = { value: new THREE.Vector3(0.4, 0.7, 0.6) }
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      '#include <common>\nuniform vec3 uPointerDirection;',
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
        float edgeFresnel = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.35);
        float pointerRim = pow(max(dot(normalize(normal), normalize(uPointerDirection)), 0.0), 2.0);
        vec3 mutedCobalt = vec3(0.38, 0.52, 0.43);
        vec3 warmSignal = vec3(0.68, 0.88, 0.35);
        outgoingLight = mix(outgoingLight, mutedCobalt, edgeFresnel * 0.28);
        outgoingLight += mutedCobalt * pointerRim * edgeFresnel * 0.15;
        outgoingLight += warmSignal * pow(edgeFresnel, 3.0) * 0.03;
        #include <opaque_fragment>
      `,
    )
    material.userData.shader = shader
  }
  material.customProgramCacheKey = () => 'bader-engineering-glass-v1'
  return material
}

export function createScreenRefractionMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSceneTexture: { value: null },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointerDirection: { value: new THREE.Vector3(0.4, 0.7, 0.6) },
      uRefractionStrength: { value: 1 },
      uCurlStrength: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormalView;
      varying vec3 vViewDirection;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormalView = normalize(normalMatrix * normal);
        vViewDirection = normalize(-viewPosition.xyz);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uSceneTexture;
      uniform vec2 uResolution;
      uniform vec3 uPointerDirection;
      uniform float uRefractionStrength;
      uniform float uCurlStrength;
      uniform float uTime;
      varying vec3 vNormalView;
      varying vec3 vViewDirection;
      void main() {
        vec3 normal = normalize(vNormalView);
        vec3 viewDirection = normalize(vViewDirection);
        float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 2.15);
        vec2 screenUv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
        vec2 bend = normal.xy * (0.006 + fresnel * 0.022) * uRefractionStrength;
        bend.x += sin((screenUv.y - 0.5) * 3.14159) * uCurlStrength;
        vec3 refracted = vec3(
          texture2D(uSceneTexture, clamp(screenUv + bend * 1.12, 0.002, 0.998)).r,
          texture2D(uSceneTexture, clamp(screenUv + bend, 0.002, 0.998)).g,
          texture2D(uSceneTexture, clamp(screenUv + bend * 0.88, 0.002, 0.998)).b
        );
        float pointerRim = pow(max(dot(normal, normalize(uPointerDirection)), 0.0), 7.0) * fresnel;
        float softNoise = sin(gl_FragCoord.x * 0.71 + gl_FragCoord.y * 0.39 + uTime * 0.12) * 0.006;
        vec3 tint = vec3(0.78, 0.89, 0.75);
        vec3 cobalt = vec3(0.33, 0.47, 0.39);
        vec3 color = mix(refracted * tint, cobalt, fresnel * 0.34);
        color += vec3(0.73, 0.92, 0.5) * pointerRim * 0.74;
        color += vec3(0.44, 0.59, 0.47) * pow(fresnel, 4.0) * 0.055;
        color += softNoise;
        gl_FragColor = vec4(color, 0.18 + fresnel * 0.47 + pointerRim * 0.15);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    side: THREE.FrontSide,
    toneMapped: true,
  })
}
