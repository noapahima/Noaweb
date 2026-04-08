import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Organic morphing sphere
    const noise3D = createNoise3D();
    const geo = new THREE.SphereGeometry(1.2, 128, 128);
    const basePositions = geo.attributes.position.array.slice();

    const mat = new THREE.MeshPhongMaterial({
      color: 0xd4c5b0,
      shininess: 60,
      specular: 0xffffff,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Lighting — warm editorial
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xf0e8d8, 0.6);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, -4, -3);
    scene.add(rimLight);

    // Mouse
    const mouse = { x: 0, y: 0 };
    const handleMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    // Resize
    const handleResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animate
    let animId;
    let t = 0;
    const pos = geo.attributes.position;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;

      // Morph vertices with noise
      for (let i = 0; i < pos.count; i++) {
        const ox = basePositions[i * 3];
        const oy = basePositions[i * 3 + 1];
        const oz = basePositions[i * 3 + 2];
        const n = noise3D(ox * 0.8 + t, oy * 0.8 + t * 0.6, oz * 0.8 + t * 0.4);
        const displacement = 1 + n * 0.22;
        pos.setXYZ(i, ox * displacement, oy * displacement, oz * displacement);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      // Smooth mouse follow rotation
      mesh.rotation.y += (mouse.x * 0.4 - mesh.rotation.y) * 0.04;
      mesh.rotation.x += (mouse.y * 0.2 - mesh.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" />;
}
