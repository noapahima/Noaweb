import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';

function SpinningText() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 1.4;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/helvetiker_bold.typeface.json"
          size={0.52}
          height={0.18}
          curveSegments={16}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.015}
          bevelSegments={6}
        >
          Noa
          <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.15} />
        </Text3D>
      </Center>
    </group>
  );
}

export default function LogoCanvas() {
  return (
    <div style={{
      position: 'fixed',
      top: '0.5rem',
      left: '1rem',
      width: '120px',
      height: '56px',
      zIndex: 201,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 4]} intensity={1.4} />
        <directionalLight position={[-4, -2, -2]} intensity={0.5} color="#8888ff" />
        <Suspense fallback={null}>
          <SpinningText />
        </Suspense>
      </Canvas>
    </div>
  );
}
