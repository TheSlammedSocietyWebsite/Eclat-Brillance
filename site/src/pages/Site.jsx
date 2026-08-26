import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Apropos from '../components/Apropos.jsx';
import Prestations from '../components/Prestations.jsx';
import Atouts from '../components/Atouts.jsx';
import Departements from '../components/Departements.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import '../index.css';

export default function Site() {
  useEffect(() => {
    if (window.location.hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <div id="top" />
      <Header />
      <main id="main">
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
