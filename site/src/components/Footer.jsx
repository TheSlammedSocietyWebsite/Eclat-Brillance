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
          <span className="brand-name">
            <EditableText path="site.name" tag="span">{site.name}</EditableText>
          </span>
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
            <a href="#contact">
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
            <EditableText path="footer.mentions" tag="span">{footer.mentions}</EditableText>
          </span>
        </div>
      </div>
    </footer>
  );
}
