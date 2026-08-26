import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Departements() {
  const cardRef = useScrollReveal();
  const { departementsSection } = useContent();

  const section = departementsSection || {
    kicker: "Zone d’intervention",
    title: "Départements desservis",
    subtitle: "Nous intervenons sur ces départements et leurs alentours.",
    items: [
      "Paris (75)",
      "Seine-Saint-Denis (93)",
      "Hauts-de-Seine (92)",
      "Val-de-Marne (94)",
      "Val-d'Oise (95)",
      "Seine-et-Marne (77)",
      "Yvelines (78)",
      "Essonne (91)",
    ],
  };

  const items = section.items || [];

  return (
    <section className="departements-section" id="zone">
      <div className="container">
        <div className="departements-card" ref={cardRef}>
          <div className="departements-head">
            <span className="departements-kicker">
              <MapPinIcon />
              <EditableText path="departementsSection.kicker" tag="span">
                {section.kicker}
              </EditableText>
            </span>
            <h2 className="departements-title">
              <EditableText path="departementsSection.title" tag="span">
                {section.title}
              </EditableText>
            </h2>
            <p className="departements-subtitle">
              <EditableText path="departementsSection.subtitle" tag="span">
                {section.subtitle}
              </EditableText>
            </p>
          </div>

          <div className="departements-pills" role="list">
            {items.map((dept, i) => (
              <div key={i} className="departement-pill" role="listitem">
                <span className="departement-pill-dot" aria-hidden="true" />
                <EditableText path={`departementsSection.items.${i}`} tag="span">
                  {dept}
                </EditableText>
                <EditableArrayControls
                  path="departementsSection.items"
                  index={i}
                  items={items}
                  itemLabel="Département"
                />
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <EditableArrayControls
                path="departementsSection.items"
                itemLabel="Département"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
