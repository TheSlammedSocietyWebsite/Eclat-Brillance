import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableImage from './edit/EditableImage.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

export default function Apropos() {
  const copyRef = useScrollReveal();
  const figureRef = useScrollReveal();
  const { apropos, images } = useContent();

  const img1 = images?.apropos1 || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';
  const img2 = images?.apropos2 || 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80';

  return (
    <section className="apropos" id="apropos">
      <div className="container apropos-inner">
        <div className="apropos-copy" ref={copyRef}>
          <span className="section-kicker">
            <EditableText path="apropos.kicker">{apropos.kicker}</EditableText>
          </span>
          <h2>
            <EditableText path="apropos.title" tag="span">{apropos.title}</EditableText>
          </h2>
          <p>
            <EditableText path="apropos.body" multiline tag="span">{apropos.body}</EditableText>
          </p>
          <ul className="apropos-highlights">
            {apropos.highlights.map((item, i) => (
              <li key={i}>
                <EditableText path={`apropos.highlights.${i}`} tag="span">{item}</EditableText>
                <EditableArrayControls path="apropos.highlights" index={i} items={apropos.highlights} itemLabel="Atout" />
              </li>
            ))}
            <li style={{ listStyle: 'none' }}>
              <EditableArrayControls path="apropos.highlights" itemLabel="Atout" />
            </li>
          </ul>
        </div>
        <div className="apropos-figure" ref={figureRef} aria-hidden="true">
          <EditableImage path="images.apropos1">
            <div
              className="figure-card figure-card-1"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(26,43,74,0.45), rgba(26,43,74,0.15)), url("${img1}")` }}
            />
          </EditableImage>
          <EditableImage path="images.apropos2">
            <div
              className="figure-card figure-card-2"
              style={{ backgroundImage: `linear-gradient(135deg, rgba(107,143,113,0.25), rgba(248,248,246,0.1)), url("${img2}")` }}
            />
          </EditableImage>
        </div>
      </div>
    </section>
  );
}
