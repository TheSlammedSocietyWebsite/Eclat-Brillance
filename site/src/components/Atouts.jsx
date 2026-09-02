'use client';

import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

const ATOUT_FIELDS = [
  { path: 'num', label: 'Numéro' },
  { path: 'title', label: 'Titre' },
  { path: 'body', label: 'Description', multiline: true },
];

function AtoutItem({ num, title, body, index, atouts }) {
  const ref = useScrollReveal();
  return (
    <div className="atout" ref={ref} style={{ position: 'relative' }}>
      <span className="atout-num">
        <EditableText path={`atouts.${index}.num`} tag="span">{num}</EditableText>
      </span>
      <h3>
        <EditableText path={`atouts.${index}.title`} tag="span">{title}</EditableText>
      </h3>
      <p>
        <EditableText path={`atouts.${index}.body`} multiline tag="span">{body}</EditableText>
      </p>
      <div style={{ marginTop: '0.5rem' }}>
        <EditableArrayControls path="atouts" index={index} items={atouts} itemLabel="Atout" fields={ATOUT_FIELDS} />
      </div>
    </div>
  );
}

export default function Atouts() {
  const headRef = useScrollReveal();
  const { atouts, atoutsSection } = useContent();

  return (
    <section className="atouts" id="atouts">
      <div className="container">
        <header className="section-head section-head-light" ref={headRef}>
          <span className="section-kicker">
            <EditableText path="atoutsSection.kicker">{atoutsSection.kicker}</EditableText>
          </span>
          <h2>
            <EditableText path="atoutsSection.title" tag="span">{atoutsSection.title}</EditableText>
          </h2>
        </header>
        <div className="atouts-grid">
          {atouts.map((a, i) => (
            <AtoutItem key={i} {...a} index={i} atouts={atouts} />
          ))}
          <EditableArrayControls path="atouts" itemLabel="Atout" fields={ATOUT_FIELDS} />
        </div>
      </div>
    </section>
  );
}
