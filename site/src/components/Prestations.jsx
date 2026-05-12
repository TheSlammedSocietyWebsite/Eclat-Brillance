import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const PRESTATION_FIELDS = [
  { path: 'title', label: 'Titre' },
  { path: 'body', label: 'Description', multiline: true },
  { path: 'iconPaths', label: 'Icônes SVG', multiline: true },
];

function ServiceIcon({ iconPaths }) {
  const trimmed = (iconPaths || '').trim();
  const isFullSvg = trimmed.toLowerCase().startsWith('<svg');
  const html = isFullSvg
    ? trimmed
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${trimmed}</svg>`;
  return <span className="service-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ServiceCard({ title, body, iconPaths, index, prestations }) {
  const ref = useScrollReveal();
  return (
    <article className="service-card" ref={ref} style={{ position: 'relative' }}>
      <ServiceIcon iconPaths={iconPaths} />
      <h3>
        <EditableText path={`prestations.${index}.title`} tag="span">{title}</EditableText>
      </h3>
      <p>
        <EditableText path={`prestations.${index}.body`} multiline tag="span">{body}</EditableText>
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <EditableText path={`prestations.${index}.iconPaths`} multiline tag="span">{iconPaths}</EditableText>
        <EditableArrayControls path="prestations" index={index} items={prestations} itemLabel="Prestation" fields={PRESTATION_FIELDS} />
      </div>
    </article>
  );
}

export default function Prestations() {
  const headRef = useScrollReveal();
  const { prestations, prestationsSection } = useContent();

  return (
    <section className="prestations" id="prestations">
      <div className="container">
        <header className="section-head" ref={headRef}>
          <span className="section-kicker">
            <EditableText path="prestationsSection.kicker">{prestationsSection.kicker}</EditableText>
          </span>
          <h2>
            <EditableText path="prestationsSection.title" tag="span">{prestationsSection.title}</EditableText>
          </h2>
          <p>
            <EditableText path="prestationsSection.lead" multiline tag="span">{prestationsSection.lead}</EditableText>
          </p>
        </header>
        <div className="service-grid">
          {prestations.map((p, i) => (
            <ServiceCard key={i} {...p} index={i} prestations={prestations} />
          ))}
          <EditableArrayControls path="prestations" itemLabel="Prestation" fields={PRESTATION_FIELDS} />
        </div>
      </div>
    </section>
  );
}
