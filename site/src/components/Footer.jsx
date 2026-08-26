import { useContent } from '../hooks/useContent.jsx';
import EditableText from './edit/EditableText.jsx';
import EditableArrayControls from './edit/EditableArrayControls.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  const { site, footer } = useContent();
  const lines = footer.description.split('\n');

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src="/logo.svg" alt="Éclat Brillance — Nettoyage professionnel" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <span className="brand-name">
              <EditableText path="site.name" tag="span">{site.name}</EditableText>
            </span>
          </div>
          <p>
            {lines.map((line, i) => (
              <span key={i}>
                <EditableText path="footer.description" multiline tag="span">{line}</EditableText>
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <div className="footer-contact">
          <h4>
            <EditableText path="footer.contactHeading" tag="span">{footer.contactHeading}</EditableText>
          </h4>
          <p>
            <a href={site.telHref}>
              <EditableText path="site.tel" tag="span">{site.tel}</EditableText>
            </a>
            <br/>
            <a href={`mailto:${site.email}`}>
              <EditableText path="site.email" tag="span">{site.email}</EditableText>
            </a>
          </p>
        </div>
        <div className="footer-legal">
          <h4>
            <EditableText path="footer.infoHeading" tag="span">{footer.infoHeading}</EditableText>
          </h4>
          <p>
            {footer.infoLines.map((line, i) => (
              <span key={i}>
                <EditableText path={`footer.infoLines.${i}`} tag="span">{line}</EditableText>
                <EditableArrayControls path="footer.infoLines" index={i} items={footer.infoLines} itemLabel="Ligne" />
                <br/>
              </span>
            ))}
            <EditableArrayControls path="footer.infoLines" itemLabel="Ligne" />
            <a href={typeof window !== 'undefined' && window.location.pathname !== '/' ? '/#contact' : '#contact'}>
              <EditableText path="footer.devisLabel" tag="span">{footer.devisLabel}</EditableText>
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>
            © {year} <EditableText path="site.name" tag="span">{site.name}</EditableText> —{' '}
            <EditableText path="footer.legal" tag="span">{footer.legal}</EditableText>
          </span>
          <span>
            <a href="/mentions-legales" className="footer-legal-link">
              <EditableText path="footer.mentions" tag="span">{footer.mentions}</EditableText>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
