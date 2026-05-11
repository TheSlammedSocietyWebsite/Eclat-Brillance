import { useContent } from '../hooks/useContent.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  const { site, footer } = useContent();
  const lines = footer.description.split('\n');

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-name">{site.name}</span>
          <p>
            {lines.map((line, i) => (
              <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
            ))}
          </p>
        </div>
        <div className="footer-contact">
          <h4>{footer.contactHeading}</h4>
          <p>
            <a href={site.telHref}>{site.tel}</a><br/>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div className="footer-legal">
          <h4>{footer.infoHeading}</h4>
          <p>
            {footer.infoLines.map((line, i) => (
              <span key={i}>{line}<br/></span>
            ))}
            <a href="#contact">{footer.devisLabel}</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {year} {site.name} — {footer.legal}</span>
          <span>{footer.mentions}</span>
        </div>
      </div>
    </footer>
  );
}
