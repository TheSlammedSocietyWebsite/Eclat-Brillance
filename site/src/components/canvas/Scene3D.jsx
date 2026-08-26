import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Scene 3D : bulles de savon / éclats de lumière — métaphore du propre / clarté
// Fixe en arrière-plan, réactive au scroll + souris, respect reduced-motion & mobile
export default function Scene3D() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xF8F8F6, 8, 22);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);

    // Lights — studio doux
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(4, 8, 5);
    scene.add(dir);
    const point1 = new THREE.PointLight(0x8fbf9a, 0.9, 30);
    point1.position.set(-5, 2, 3);
    scene.add(point1);
    const point2 = new THREE.PointLight(0xb8935a, 0.55, 28);
    point2.position.set(5, -3, 2);
    scene.add(point2);

    // Groupe bulles
    const bubbleGroup = new THREE.Group();
    scene.add(bubbleGroup);

    const bubbleCount = isMobile ? 3 : isLowEnd ? 4 : 6;
    const bubbles = [];
    const geometries = [
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.IcosahedronGeometry(1, 1),
    ];

    const palette = [
      { color: 0xffffff, tint: 0xEAF0EC },
      { color: 0xf0f6f1, tint: 0xdfe9e2 },
      { color: 0xffffff, tint: 0xE8EEF0 },
    ];

    for (let i = 0; i < bubbleCount; i++) {
      const g = geometries[i % geometries.length].clone();
      const mat = new THREE.MeshPhysicalMaterial({
        color: palette[i % palette.length].color,
        transparent: true,
        opacity: 0.72,
        roughness: 0.08,
        metalness: 0.02,
        transmission: 0.92,
        ior: 1.38,
        thickness: 0.45,
        clearcoat: 1.0,
        clearcoatRoughness: 0.18,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(g, mat);
      const s = (i === 0 ? 1.7 : i === 1 ? 1.15 : i === 2 ? 0.75 : 0.55 + Math.random() * 0.45);
      mesh.scale.setScalar(s);
      // Distribution spatiale élégante
      const spreadX = isMobile ? 3.2 : 6.5;
      const spreadY = isMobile ? 4.5 : 7.0;
      mesh.position.set(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY - 0.2,
        (Math.random() - 0.5) * 2.2 - 0.6
      );
      mesh.userData = {
        baseY: mesh.position.y,
        baseX: mesh.position.x,
        rotSpeed: (Math.random() * 0.003 + 0.0015) * (Math.random() < 0.5 ? 1 : -1),
        floatSpeed: 0.35 + Math.random() * 0.55,
        floatAmp: 0.25 + Math.random() * 0.35,
        driftX: (Math.random() - 0.5) * 0.6,
        phase: Math.random() * Math.PI * 2,
      };
      bubbles.push(mesh);
      bubbleGroup.add(mesh);
    }

    // Anneau fin — clin d'oeil premium (autour de la plus grosse bulle)
    const ringGeo = new THREE.TorusGeometry(1.02, 0.009, 16, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xB8935A, transparent: true, opacity: 0.0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    if (bubbles[0]) {
      ring.scale.setScalar(bubbles[0].scale.x * 1.14);
      ring.position.copy(bubbles[0].position);
      ring.rotation.x = Math.PI * 0.38;
      ring.rotation.y = Math.PI * 0.12;
      bubbleGroup.add(ring);
    }

    // Particules poussière / lumière — points subtils
    const particleCount = isMobile ? 420 : isLowEnd ? 650 : 1100;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1.5;
      speeds[i] = 0.06 + Math.random() * 0.18;
      phases[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isMobile ? 0.018 : 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.0, // fade in
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Scroll & mouse state
    let scrollY = window.scrollY;
    let targetScroll = scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMX = 0;
    let targetMY = 0;

    const onScroll = () => { targetScroll = window.scrollY; };
    const onMouseMove = (e) => {
      targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    };
    window.addEventListener('resize', onResize);

    let time = 0;
    const scrollMax = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += prefersReduced ? 0.002 : 0.009;

      // Lerp scroll & mouse
      scrollY += (targetScroll - scrollY) * (prefersReduced ? 0.08 : 0.05);
      mouseX += (targetMX - mouseX) * 0.03;
      mouseY += (targetMY - mouseY) * 0.03;
      const progress = scrollY / scrollMax(); // 0..1

      // Fade in particules au premier scroll
      if (pMat.opacity < 0.42) pMat.opacity += 0.004;

      // Camera — léger travelling vertical + tilt souris
      if (!prefersReduced) {
        camera.position.y = 0.4 - progress * 1.65;
        camera.position.x = mouseX * 0.45;
        camera.lookAt(0, -progress * 0.9, 0);
        // Subtle group rotation
        bubbleGroup.rotation.y = mouseX * 0.08 + progress * 0.18;
        bubbleGroup.rotation.x = mouseY * 0.05 - progress * 0.10;
      }

      // Bulles — float + rotation + scroll parallax
      bubbles.forEach((m, i) => {
        const ud = m.userData;
        const float = Math.sin(time * ud.floatSpeed + ud.phase) * ud.floatAmp;
        m.position.y = ud.baseY + float - progress * (0.9 + i * 0.28);
        m.position.x = ud.baseX + Math.sin(time * 0.18 + ud.phase) * 0.18 + mouseX * (0.12 + i * 0.04);
        if (!prefersReduced) {
          m.rotation.y += ud.rotSpeed;
          m.rotation.x += ud.rotSpeed * 0.6;
          m.rotation.z += ud.rotSpeed * 0.3;
        }
        // Scroll — scale & opacity micro
        const depthFade = 1 - Math.min(1, Math.abs(progress - 0.18 - i * 0.09) * 2.6);
        m.material.opacity = 0.42 + depthFade * 0.28;
        // Ring suit la première bulle
        if (i === 0 && ring) {
          ring.position.copy(m.position);
          ring.position.z += 0.02;
          ring.rotation.y += 0.0012;
          ring.material.opacity = 0.0 + depthFade * 0.18;
        }
      });

      // Particules — drift lent + scroll
      const pos = pGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3 + 1;
        pos.array[idx] += Math.sin(time * 0.45 + phases[i]) * 0.0009 * speeds[i];
        // Scroll fait monter les particules (nettoyage = clarification)
        pos.array[idx] -= progress * 0.0006 * (1 + speeds[i]);
        // Loop vertical
        if (pos.array[idx] < -7) pos.array[idx] = 7;
        if (pos.array[idx] > 7) pos.array[idx] = -7;
        // Légère dérive X liée à la souris
        pos.array[i * 3] += mouseX * 0.00035;
      }
      pos.needsUpdate = true;
      pMat.opacity = 0.18 + Math.sin(time * 0.22) * 0.04;
      if (isMobile) pMat.opacity *= 0.65;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometries.forEach(g => g.dispose());
      pGeo.dispose();
      pMat.dispose();
      bubbles.forEach(b => b.material.dispose());
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="scene3d-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 1,
      }}
    />
  );
}
