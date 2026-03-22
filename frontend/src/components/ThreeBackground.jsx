import { useEffect, useRef } from "react";

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    import("three").then((THREE) => {
      const canvas = canvasRef.current;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 80;

      const N = 130;
      const pos = new Float32Array(N * 3);
      const vel = new Float32Array(N * 3);

      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 200;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
        vel[i * 3] = (Math.random() - 0.5) * 0.04;
        vel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

      const points = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0x67e8f9,
          size: 0.9,
        })
      );

      scene.add(points);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    });
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />;
};

export default ThreeBackground;
