'use client';

import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Apropos from '../components/Apropos.jsx';
import Prestations from '../components/Prestations.jsx';
import Atouts from '../components/Atouts.jsx';
import Departements from '../components/Departements.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Faq from '../components/Faq.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function Site() {
  useEffect(() => {
    if (window.location.hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <div id="top" />
      <Header />
      <main>
        <Hero />
        <Apropos />
        <Prestations />
        <Atouts />
        <Departements />
        <Testimonials />
        <Faq />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
