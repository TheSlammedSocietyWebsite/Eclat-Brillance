import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Apropos from '../components/Apropos.jsx';
import Prestations from '../components/Prestations.jsx';
import Atouts from '../components/Atouts.jsx';
import Departements from '../components/Departements.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Contact from '../components/Contact.jsx';
import { lazy, Suspense } from 'react';
import useLenis from '../hooks/useLenis.js';
import '../index.css';
const Scene3D = lazy(() => import('../components/canvas/Scene3D.jsx'));

gsap.registerPlugin(ScrollTrigger);

export default function Site() {
  const progressRef = useRef(null);
  useLenis(true);

  useEffect(() => {
    if (window.location.hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Scroll global : progress bar + GSAP interactions
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Progress bar top
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      // Hero : parallax badge + scrub fade des preuves
      gsap.to('.hero-badge', {
        yPercent: -18,
        rotation: -0.6,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 },
      });
      gsap.to('.hero-content', {
        yPercent: -8,
        opacity: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      });
      gsap.from('.hero h1', { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 });
      gsap.from('.hero .lede', { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.38 });
      gsap.from('.hero-ctas .btn', { y: 14, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.55 });

      // Apropos : parallax figures (subtle 3D tilt utilisera scroll)
      gsap.to('.figure-card-1 img', {
        yPercent: -10,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: '.apropos', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.to('.figure-card-2 img', {
        yPercent: 12,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: '.apropos', start: 'top bottom', end: 'bottom top', scrub: 1.05 },
      });
      gsap.to('.figure-card-1', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.apropos', start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
      gsap.to('.figure-card-2', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.apropos', start: 'top bottom', end: 'bottom top', scrub: 1.15 } });

      // Prestations : 3D stacking + stagger (desktop = scrub parallax, mobile = reveal)
      if (window.innerWidth >= 992) {
        const cards = gsap.utils.toArray('.service-card');
        // Légère perspective 3D au scroll — pas de pin pour éviter le jank, scrub subtil
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 42 + (i % 3) * 8,
            opacity: 0,
            scale: 0.96,
            rotationX: 4,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          });
          // Parallax très léger au scroll
          gsap.to(card, {
            yPercent: -3 - (i % 2) * 2,
            ease: 'none',
            scrollTrigger: { trigger: '.prestations', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          });
        });
        // Effet pin léger sur le header de section (reste visible)
        ScrollTrigger.create({
          trigger: '.prestations',
          start: 'top top+=110',
          end: 'bottom top+=80',
          pin: '.prestations .section-head',
          pinSpacing: false,
        });
      } else {
        gsap.utils.toArray('.service-card').forEach((card, i) => {
          gsap.from(card, {
            y: 28, opacity: 0, duration: 0.6, delay: i * 0.05, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%' },
          });
        });
      }

      // Atouts : stagger + léger scrub de l'ensemble
      gsap.from('.atout', {
        y: 32, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: '.atouts', start: 'top 78%' },
      });
      gsap.to('.atouts-grid', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: '.atouts', start: 'top bottom', end: 'bottom top', scrub: 1.1 },
      });

      // Departements : pills scrub stagger
      gsap.from('.departement-pill', {
        y: 18, opacity: 0, scale: 0.96, duration: 0.55, stagger: 0.045, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.departements-section', start: 'top 82%' },
      });

      // Testimonials : scale + fade
      gsap.utils.toArray('.testimonial-card').forEach((card) => {
        gsap.from(card, {
          y: 22, opacity: 0, scale: 0.98, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });

      // CTA banner : glow pulse au passage
      gsap.from('.cta-banner-inner', {
        y: 18, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-banner', start: 'top 88%' },
      });

      // Header hide on scroll down / show on up
      let lastY = window.scrollY;
      ScrollTrigger.create({
        start: 0,
        end: 999999,
        onUpdate: (self) => {
          const curr = self.scroll();
          const header = document.querySelector('.site-header');
          if (!header) return;
          if (curr > lastY && curr > 120) header.classList.add('is-hidden');
          else header.classList.remove('is-hidden');
          lastY = curr;
        },
      });

      // Tilt subtil sur les cartes prestations au survol (desktop)
      if (window.innerWidth >= 992) {
        document.querySelectorAll('.service-card').forEach((card) => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotationY: x * 7, rotationX: -y * 7, duration: 0.5, ease: 'power3.out', transformPerspective: 900 });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'power3.out' });
          });
        });
      }

      // Contact : form lève au scroll
      gsap.from('.contact-form', {
        y: 36, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 78%' },
      });

    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      {/* Progress thin bar */}
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #5E8A68, #B8935A)',
          transformOrigin: '0 50%',
          transform: 'scaleX(0)',
          zIndex: 60,
          pointerEvents: 'none',
        }}
      />
      <a href="#main" className="skip-link">Aller au contenu</a>
      <div id="top" />
      <Header />
      <main id="main" className="overflow-x-hidden w-full max-w-full" style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Apropos />
        <Prestations />
        <Atouts />
        <Departements />
        <Testimonials />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
