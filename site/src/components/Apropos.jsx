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
            <li className="cms-controls" style={{ listStyle: 'none' }}>
              <EditableArrayControls path="apropos.highlights" itemLabel="Atout" />
            </li>
          </ul>
        </div>
        <div className="apropos-figure" ref={figureRef}>
          <EditableImage path="images.apropos1">
            <div
              className="figure-card figure-card-1"
            >
              <img src={img1} alt="Nettoyage professionnel de locaux" width="800" height="1000" loading="lazy" decoding="async" />
            </div>
          </EditableImage>
          <EditableImage path="images.apropos2">
            <div
              className="figure-card figure-card-2"
            >
              <img src={img2} alt="Entretien de bureaux et espaces professionnels" width="800" height="1000" loading="lazy" decoding="async" />
            </div>
          </EditableImage>
        </div>
      </div>
    </section>
  );
}
