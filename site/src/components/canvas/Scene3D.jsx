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
    // Pas de fog opaque — on veut voir la 3D nettement sur fond clair
    scene.fog = new THREE.Fog(0xF8F8F6, 12, 28);

    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 7.0);

    // Lights — studio plus contrasté pour que la 3D ressorte
    const ambient = new THREE.AmbientLight(0xffffff, 1.05);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(3, 7, 5);
    scene.add(dir);
    const point1 = new THREE.PointLight(0x5E8A68, 1.2, 30);
    point1.position.set(-4.5, 1.8, 3.2);
    scene.add(point1);
    const point2 = new THREE.PointLight(0xB8935A, 0.95, 28);
    point2.position.set(4.2, -2.2, 2.4);
    scene.add(point2);
    const rim = new THREE.PointLight(0x1a2b4a, 0.45, 22);
    rim.position.set(0, 4, -4);
    scene.add(rim);

    // Groupe bulles
    const bubbleGroup = new THREE.Group();
    scene.add(bubbleGroup);

    const bubbleCount = isMobile ? 4 : isLowEnd ? 5 : 7;
    const bubbles = [];
    const geometries = [
      new THREE.SphereGeometry(1, 36, 36),
      new THREE.SphereGeometry(1, 36, 36),
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.TorusGeometry(0.9, 0.28, 24, 48),
    ];

    // Palette marque — visible sur fond clair
    const palette = [
      { color: 0xEAF0EC, emissive: 0x5E8A68, emissiveIntensity: 0.08 }, // sage très clair, légèrement lumineux
      { color: 0xFFF8ED, emissive: 0xB8935A, emissiveIntensity: 0.10 }, // ivoire doré
      { color: 0xE8EEF2, emissive: 0x1A2B4A, emissiveIntensity: 0.06 }, // bleu-ink pâle
      { color: 0xFFFFFF, emissive: 0x5E8A68, emissiveIntensity: 0.07 },
    ];

    for (let i = 0; i < bubbleCount; i++) {
      const g = geometries[i % geometries.length].clone();
      const pal = palette[i % palette.length];
      const mat = new THREE.MeshPhysicalMaterial({
        color: pal.color,
        emissive: pal.emissive,
        emissiveIntensity: pal.emissiveIntensity,
        transparent: true,
        opacity: i === 0 ? 0.88 : 0.78,
        roughness: 0.12,
        metalness: 0.03,
        transmission: i < 2 ? 0.78 : 0.62,
        ior: 1.42,
        thickness: 0.55,
        clearcoat: 1.0,
        clearcoatRoughness: 0.14,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(g, mat);
      // Tailles généreuses — hero orb bien visible
      const s = (i === 0 ? 2.05 : i === 1 ? 1.38 : i === 2 ? 0.92 : 0.62 + Math.random() * 0.42);
      mesh.scale.setScalar(s);
      // Placement : orb héro centré + autres en périphérie
      let x, y, z;
      if (i === 0) {
        // Grosse bulle héro — légèrement à droite derrière le badge, très visible
        x = isMobile ? 0.2 : 2.35;
        y = isMobile ? 0.9 : 0.35;
        z = 0.2;
      } else if (i === 1) {
        x = isMobile ? -1.1 : -2.8;
        y = isMobile ? -0.6 : 1.15;
        z = -0.4;
      } else {
        const spreadX = isMobile ? 3.4 : 7.2;
        const spreadY = isMobile ? 4.2 : 7.5;
        x = (Math.random() - 0.5) * spreadX;
        y = (Math.random() - 0.5) * spreadY - 0.15;
        z = (Math.random() - 0.5) * 2.4 - 0.3;
      }
      mesh.position.set(x, y, z);
      mesh.userData = {
        baseY: y,
        baseX: x,
        rotSpeed: (Math.random() * 0.004 + 0.0018) * (Math.random() < 0.5 ? 1 : -1),
        floatSpeed: 0.32 + Math.random() * 0.48,
        floatAmp: 0.30 + Math.random() * 0.42,
        driftX: (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2,
        isHero: i === 0,
      };
      bubbles.push(mesh);
      bubbleGroup.add(mesh);
    }
    // Debug log
    console.log('[Scene3D] bubbles', bubbles.length, 'mobile', isMobile);

    // Anneau premium autour de la bulle héro — bien visible
    const ringGeo = new THREE.TorusGeometry(1.02, 0.012, 16, 96);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xB8935A, transparent: true, opacity: 0.32 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    if (bubbles[0]) {
      ring.scale.setScalar(bubbles[0].scale.x * 1.08);
      ring.position.copy(bubbles[0].position);
      ring.rotation.x = Math.PI * 0.42;
      ring.rotation.y = Math.PI * 0.14;
      bubbleGroup.add(ring);
    }
    // Deuxième anneau plus fin, doré clair
    const ring2Geo = new THREE.TorusGeometry(1.02, 0.006, 16, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x5E8A68, transparent: true, opacity: 0.22 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    if (bubbles[0]) {
      ring2.scale.setScalar(bubbles[0].scale.x * 1.18);
      ring2.position.copy(bubbles[0].position);
      ring2.rotation.x = -Math.PI * 0.22;
      ring2.rotation.y = -Math.PI * 0.08;
      bubbleGroup.add(ring2);
    }

    // Particules — plus visibles, couleur marque
    const particleCount = isMobile ? 520 : isLowEnd ? 720 : 1250;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const colSage = new THREE.Color(0x5E8A68);
    const colGold = new THREE.Color(0xB8935A);
    const colWhite = new THREE.Color(0xffffff);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 19;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1.2;
      // Couleurs mélangées
      const c = i % 3 === 0 ? colSage : i % 3 === 1 ? colGold : colWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speeds[i] = 0.07 + Math.random() * 0.20;
      phases[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.024 : 0.028,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
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

      // Bulles — float + rotation + scroll parallax (hero orb reste visible)
      bubbles.forEach((m, i) => {
        const ud = m.userData;
        const float = Math.sin(time * ud.floatSpeed + ud.phase) * ud.floatAmp;
        // Hero orb : reste dans le viewport hero plus longtemps
        const heroFactor = ud.isHero ? Math.min(progress * 0.55, 0.55) : progress * (0.9 + i * 0.22);
        m.position.y = ud.baseY + float - heroFactor * (ud.isHero ? 1.2 : 1.0);
        m.position.x = ud.baseX + Math.sin(time * 0.18 + ud.phase) * 0.14 + mouseX * (0.14 + i * 0.05);
        if (!prefersReduced) {
          m.rotation.y += ud.rotSpeed;
          m.rotation.x += ud.rotSpeed * 0.6;
          m.rotation.z += ud.rotSpeed * 0.3;
          if (ud.isHero) m.rotation.y += 0.001; // rotation hero plus lente et majestueuse
        }
        // Scroll — hero reste opaque, autres fade
        if (ud.isHero) {
          m.material.opacity = 0.88 - progress * 0.28;
          m.scale.setScalar(2.05 - progress * 0.35);
        } else {
          const depthFade = 1 - Math.min(1, Math.abs(progress - 0.18 - i * 0.09) * 2.4);
          m.material.opacity = 0.52 + depthFade * 0.26;
        }
        // Rings suivent hero
        if (i === 0) {
          if (ring) {
            ring.position.copy(m.position);
            ring.position.z += 0.02;
            ring.rotation.y += 0.0014;
            ring.rotation.z += 0.0006;
            ring.material.opacity = 0.32 - progress * 0.12;
          }
          if (ring2) {
            ring2.position.copy(m.position);
            ring2.position.z -= 0.02;
            ring2.rotation.y -= 0.0011;
            ring2.material.opacity = 0.22 - progress * 0.08;
          }
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
      pGeo.attributes.color.needsUpdate = true;
      pMat.opacity = 0.38 + Math.sin(time * 0.22) * 0.06;
      if (isMobile) pMat.opacity *= 0.78;
      // Pulse léger des particules au scroll
      pMat.size = (isMobile ? 0.024 : 0.028) + progress * 0.006;

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
      ring2Geo.dispose();
      ring2Mat.dispose();
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
