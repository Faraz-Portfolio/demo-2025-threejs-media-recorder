import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "./ContactShadows";
import { Model } from "./Model";
import { Recorder, RecorderTunnel } from "./Recorder";

export default function App() {
  return (
    <>
      <Canvas
        gl={{
          preserveDrawingBuffer: true, // Required for screenshot functionality
        }}
      >
        <OrbitControls makeDefault target={[0, 1.5, 0]} />
        <PerspectiveCamera position={[-4, 4, 4]} makeDefault />

        <Model />
        <Sparkles
          size={6}
          scale={[10, 10, 10]}
          position={[0, 1.5, 0]}
          speed={0.5}
          count={50}
        />

        <Environment preset="sunset" background blur={0.3} />

        <ContactShadows opacity={0.5} />

        <Recorder />
      </Canvas>
      <RecorderTunnel.Out />
    </>
  );
}
