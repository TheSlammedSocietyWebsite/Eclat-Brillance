import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Apropos from '../components/Apropos.jsx';
import Prestations from '../components/Prestations.jsx';
import Atouts from '../components/Atouts.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import '../index.css';

export default function Site() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Apropos />
        <Prestations />
        <Atouts />
        <Testimonials />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
