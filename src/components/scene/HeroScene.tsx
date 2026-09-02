import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { CardboardBox, useMaterials } from './models'

/**
 * Peça 3D composta sobre a foto real da loja: a caixa impressa da marca em
 * três quartos, ancorada por sombra de contato. Sem piso, sem cenário e sem
 * post-processing — o ambiente é a fotografia, o 3D é só o objeto em foco.
 */
function Piece({
  progress,
  high,
}: {
  progress: React.MutableRefObject<number>
  high: boolean
}) {
  const m = useMaterials()
  const group = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const { pointer, camera, clock } = state
    const k = Math.min(1, delta * 2.6)
    mouse.current.x += (pointer.x - mouse.current.x) * k
    mouse.current.y += (pointer.y - mouse.current.y) * k

    // dolly: plano médio -> close no lacre impresso
    const p = progress.current
    const e = p * p * (3 - 2 * p)
    const wide = state.size.width / state.size.height > 1.1

    // três quartos, um pouco acima da caixa: topo e duas faces visíveis
    camera.position.set(
      THREE.MathUtils.lerp(2.05, 1.35, e) + mouse.current.x * 0.3,
      THREE.MathUtils.lerp(1.5, 1.15, e) - mouse.current.y * 0.22,
      THREE.MathUtils.lerp(wide ? 3.1 : 3.7, wide ? 2.2 : 2.7, e),
    )
    camera.lookAt(0, THREE.MathUtils.lerp(0.62, 0.72, e), 0)

    if (group.current) {
      group.current.rotation.y =
        -0.26 + Math.sin(clock.elapsedTime * 0.12) * 0.05 + mouse.current.x * 0.14 + p * 0.5
      group.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.008
    }
  })

  return (
    <>
      <group ref={group}>
        <CardboardBox m={m} size={[1.5, 1.05, 1.15]} position={[0, 0.525, 0]} />
        <CardboardBox
          m={m}
          size={[1.1, 0.62, 0.9]}
          position={[-0.12, 1.36, -0.06]}
          rotation={[0, 0.34, 0]}
        />
      </group>

      {/* ancoragem na foto: sombra suave no lugar de um piso 3D */}
      <ContactShadows
        position={[0, 0.002, 0]}
        scale={5.5}
        blur={2.4}
        opacity={0.75}
        far={2.2}
        resolution={high ? 512 : 256}
        color="#0b0907"
      />
    </>
  )
}

export default function HeroScene({
  progress,
  high,
  onReady,
}: {
  progress: React.MutableRefObject<number>
  high: boolean
  onReady?: () => void
}) {
  return (
    <Canvas
      shadows={false}
      dpr={high ? [1, 1.6] : [1, 1.25]}
      camera={{ position: [2.05, 1.5, 3.1], fov: 36 }}
      gl={{ antialias: high, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        // exposição baixa: a peça precisa ficar na mesma luz da fotografia
        gl.toneMappingExposure = 0.62
        requestAnimationFrame(() => onReady?.())
      }}
    >
      <ambientLight intensity={0.42} color="#b9a68b" />
      <hemisphereLight args={['#5d4c39', '#0d0b09', 0.45]} />

      {/* key light quente, na direção das luminárias da foto */}
      <spotLight
        position={[3.2, 7.4, 2.4]}
        angle={0.75}
        penumbra={0.95}
        intensity={95}
        distance={20}
        color="#f4e3c8"
      />
      {/* contraluz e acento da marca */}
      <spotLight
        position={[-4.6, 4.2, -3.6]}
        angle={0.95}
        penumbra={1}
        intensity={40}
        distance={20}
        color="#8fb4d6"
      />
      <pointLight position={[-1.8, 1.4, 2.6]} intensity={6} color="#c8401d" distance={8} />

      {/* reflexos sem HDRI externo */}
      <Environment resolution={64} frames={1} background={false}>
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#ffe6bf"
          position={[0, 5, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[9, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.6}
          color="#8fb4d6"
          position={[-5, 2, -3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[7, 4, 1]}
        />
        <Lightformer
          form="circle"
          intensity={0.85}
          color="#c8401d"
          position={[4, 1.5, 3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={3.4}
        />
      </Environment>

      <Piece progress={progress} high={high} />
    </Canvas>
  )
}
