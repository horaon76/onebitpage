import * as THREE from "three";
import { useEffect, useRef } from "react";

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "-1"; // Puts it behind the game canvas

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Stars Background
    const starGeometry = new THREE.BufferGeometry();
    const starVertices: number[] = [];
    for (let i = 0; i < 6000; i++) {
      starVertices.push((Math.random() - 0.5) * 100);
      starVertices.push((Math.random() - 0.5) * 100);
      starVertices.push((Math.random() - 0.5) * 100);
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001; // Slow rotation effect
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", width: "100%", height: "100%", zIndex: "-1" }} />;
};

export default ThreeBackground;
