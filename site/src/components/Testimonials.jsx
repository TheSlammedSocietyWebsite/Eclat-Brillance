import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';

function TestimonialCard({ quote, author, role }) {
  const ref = useScrollReveal();
  return (
    <blockquote className="testimonial-card" ref={ref}>
      <p className="testimonial-quote">{quote}</p>
      <footer>
        <cite>
          <span className="testimonial-author">{author}</span>
          <span className="testimonial-role">{role}</span>
        </cite>
      </footer>
    </blockquote>
  );
}

export default function Testimonials() {
  const headRef = useScrollReveal();
  const { testimonials, testimonialsSection } = useContent();

  return (
    <section className="testimonials" id="temoignages">
      <div className="container">
        <header className="section-head" ref={headRef}>
          <span className="section-kicker">{testimonialsSection.kicker}</span>
          <h2>{testimonialsSection.title}</h2>
        </header>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
