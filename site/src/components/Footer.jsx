import { siteConfig, footer } from '../data/content.js';

export default function Footer() {
  const year = new Date().getFullYear();
  const lines = footer.description.split('\n');

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-name">{siteConfig.name}</span>
          <p>
            {lines.map((line, i) => (
              <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
            ))}
          </p>
        </div>
        <div className="footer-contact">
          <h4>{footer.contactHeading}</h4>
          <p>
            <a href={siteConfig.telHref}>{siteConfig.tel}</a><br/>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
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
          <span>© {year} {siteConfig.name} — {footer.legal}</span>
          <span>{footer.mentions}</span>
        </div>
      </div>
    </footer>
  );
}
