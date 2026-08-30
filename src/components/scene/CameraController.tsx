import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useRescueTwinStore } from '../../state/rescueTwinStore';

export const CameraController: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useRescueTwinStore((s) => s.digitalTwin.cameraPreset);
  const zoomDistance = useRescueTwinStore((s) => s.cameraZoomDistance);

  const targetPos = useRef(new THREE.Vector3(14, 12, 16));
  const targetLook = useRef(new THREE.Vector3(0, 2.5, 0));
  const isTransitioning = useRef(false);

  // When a preset button is clicked, animate smoothly to that viewpoint
  useEffect(() => {
    switch (cameraPreset) {
      case 'COMMAND':
        targetPos.current.set(14, 12, 16);
        targetLook.current.set(0, 2.5, 0);
        break;
      case 'AERIAL':
        targetPos.current.set(0, 22, 6);
        targetLook.current.set(0, 1.5, 0);
        break;
      case 'BUILDING':
        targetPos.current.set(-9.0, 9.0, 11.0);
        targetLook.current.set(-1.5, 3.5, 1.0);
        break;
      case 'ROBOT':
        targetPos.current.set(5.5, 5.0, 10.5);
        targetLook.current.set(0.5, 0.5, 2.0);
        break;
    }
    isTransitioning.current = true;
  }, [cameraPreset]);

  // Adjust zoom distance smoothly when slider changes
  useEffect(() => {
    if (controlsRef.current && !isTransitioning.current) {
      const dir = camera.position.clone().sub(controlsRef.current.target).normalize();
      camera.position.copy(controlsRef.current.target.clone().add(dir.multiplyScalar(zoomDistance)));
      controlsRef.current.update();
    }
  }, [zoomDistance, camera]);

  // Attach controls listeners: if user starts dragging/rotating, stop forcing target position!
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStartInteraction = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', onStartInteraction);
    return () => {
      controls.removeEventListener('start', onStartInteraction);
    };
  }, []);

  useFrame(() => {
    if (isTransitioning.current) {
      // Smooth lerp to target camera position and lookAt target
      camera.position.lerp(targetPos.current, 0.06);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, 0.06);
        controlsRef.current.update();
      }

      // If we are close enough to destination, finish transition so user has full freedom
      if (
        camera.position.distanceTo(targetPos.current) < 0.08 &&
        controlsRef.current?.target.distanceTo(targetLook.current)! < 0.08
      ) {
        isTransitioning.current = false;
      }
    } else if (controlsRef.current) {
      // Keep smooth damping active when user is manually rotating/panning/zooming
      controlsRef.current.update();
    }
  });

  return (
    <primitive
      object={new OrbitControlsImpl(camera, gl.domElement)}
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent camera clipping below ground
      minDistance={3}
      maxDistance={45}
    />
  );
};
