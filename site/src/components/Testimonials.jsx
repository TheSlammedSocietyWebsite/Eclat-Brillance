import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const TESTIMONIAL_FIELDS = [
  { path: 'quote', label: 'Citation', multiline: true },
  { path: 'author', label: 'Auteur' },
  { path: 'role', label: 'Rôle' },
];

function TestimonialCard({ quote, author, role, index, testimonials }) {
  const ref = useScrollReveal();
  return (
    <blockquote className="testimonial-card" ref={ref} style={{ position: 'relative' }}>
      <p className="testimonial-quote">
        <EditableText path={`testimonials.${index}.quote`} multiline tag="span">{quote}</EditableText>
      </p>
      <footer>
        <cite>
          <span className="testimonial-author">
            <EditableText path={`testimonials.${index}.author`} tag="span">{author}</EditableText>
          </span>
          <span className="testimonial-role">
            <EditableText path={`testimonials.${index}.role`} tag="span">{role}</EditableText>
          </span>
        </cite>
      </footer>
      <div style={{ marginTop: '0.5rem' }}>
        <EditableArrayControls path="testimonials" index={index} items={testimonials} itemLabel="Témoignage" fields={TESTIMONIAL_FIELDS} />
      </div>
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
          <span className="section-kicker">
            <EditableText path="testimonialsSection.kicker">{testimonialsSection.kicker}</EditableText>
          </span>
          <h2>
            <EditableText path="testimonialsSection.title" tag="span">{testimonialsSection.title}</EditableText>
          </h2>
        </header>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} testimonials={testimonials} />
          ))}
          <EditableArrayControls path="testimonials" itemLabel="Témoignage" fields={TESTIMONIAL_FIELDS} />
        </div>
      </div>
    </section>
  );
}
