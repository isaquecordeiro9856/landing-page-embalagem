import { useMemo } from 'react'
import * as THREE from 'three'
import { fluteMap, kraftBump, kraftMap, printMap, tapeMap } from '../../lib/textures'

/**
 * Caixa do hero: faces impressas, miolo ondulado aparente, vinco central e
 * fita de lacre. Só o necessário para a única cena 3D do site.
 */

export function useMaterials() {
  return useMemo(() => {
    const bump = kraftBump()

    const kraft = new THREE.MeshStandardMaterial({
      map: kraftMap(),
      bumpMap: bump,
      bumpScale: 0.035,
      roughness: 0.92,
      metalness: 0,
    })

    const print = new THREE.MeshStandardMaterial({
      map: printMap(),
      bumpMap: bump,
      bumpScale: 0.03,
      roughness: 0.88,
      metalness: 0,
    })

    const flute = new THREE.MeshStandardMaterial({
      map: fluteMap(),
      roughness: 0.95,
      metalness: 0,
    })

    const tape = new THREE.MeshStandardMaterial({
      map: tapeMap(),
      roughness: 0.3,
      metalness: 0.08,
    })

    return { kraft, print, flute, tape }
  }, [])
}

export type Materials = ReturnType<typeof useMaterials>

/**
 * Caixa fechada: 6 faces com mapas distintos, bordas com miolo ondulado
 * aparente, vinco central e fita de lacre atravessando o topo.
 */
export function CardboardBox({
  size = [1.5, 1.1, 1.1],
  taped = true,
  m,
  ...props
}: {
  size?: [number, number, number]
  taped?: boolean
  m: Materials
} & React.ComponentProps<'group'>) {
  const [w, h, d] = size
  // ordem BoxGeometry: +x, -x, +y, -y, +z, -z
  const faces = useMemo(() => [m.kraft, m.kraft, m.kraft, m.kraft, m.print, m.print], [m])

  const edges = useMemo(
    () =>
      [
        { p: [0, h / 2 + 0.002, d / 2], r: [0, 0, 0], l: w },
        { p: [0, h / 2 + 0.002, -d / 2], r: [0, Math.PI, 0], l: w },
        { p: [w / 2, h / 2 + 0.002, 0], r: [0, Math.PI / 2, 0], l: d },
        { p: [-w / 2, h / 2 + 0.002, 0], r: [0, -Math.PI / 2, 0], l: d },
      ] as { p: [number, number, number]; r: [number, number, number]; l: number }[],
    [w, h, d],
  )

  return (
    <group {...props}>
      <mesh material={faces}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {edges.map((e, i) => (
        <mesh key={i} position={e.p} rotation={e.r} material={m.flute}>
          <boxGeometry args={[e.l, 0.014, 0.03]} />
        </mesh>
      ))}

      <mesh position={[0, h / 2 + 0.004, 0]} material={m.flute}>
        <boxGeometry args={[w * 0.99, 0.008, 0.022]} />
      </mesh>

      {taped && (
        <group>
          <mesh position={[0, h / 2 + 0.012, 0]} material={m.tape}>
            <boxGeometry args={[w * 1.005, 0.006, 0.19]} />
          </mesh>
          <mesh position={[w / 2 + 0.008, h / 2 - 0.14, 0]} material={m.tape}>
            <boxGeometry args={[0.006, 0.28, 0.19]} />
          </mesh>
          <mesh position={[-w / 2 - 0.008, h / 2 - 0.14, 0]} material={m.tape}>
            <boxGeometry args={[0.006, 0.28, 0.19]} />
          </mesh>
        </group>
      )}
    </group>
  )
}

