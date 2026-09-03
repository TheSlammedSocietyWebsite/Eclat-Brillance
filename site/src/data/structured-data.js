import content from '../../public/content.json';
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  LEGAL_DESCRIPTION,
  LEGAL_TITLE,
  SITE_NAME,
  SITE_URL,
} from './site-config.js';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const homepageId = `${SITE_URL}/#webpage`;
const logoId = `${SITE_URL}/#logo`;
const primaryImageId = `${SITE_URL}/#primaryimage`;

const serviceAreas = [
  'Paris (75)',
  'Hauts-de-Seine (92)',
  'Seine-Saint-Denis (93)',
  'Val-de-Marne (94)',
  "Val-d'Oise (95)",
  'Yvelines (78)',
  'Essonne (91)',
  'Seine-et-Marne (77)',
].map((name) => ({
  '@type': 'AdministrativeArea',
  name,
}));

const offers = content.prestations.map(({ title, body }) => ({
  '@type': 'Offer',
  url: `${SITE_URL}/#prestations`,
  itemOffered: {
    '@type': 'Service',
    name: title,
    description: body,
    serviceType: title,
    provider: { '@id': organizationId },
  },
}));

export const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': organizationId,
      name: SITE_NAME,
      alternateName: 'Eclat Brillance',
      legalName: 'STACY COMPAN (ECLAT BRILLANCE)',
      description: HOME_DESCRIPTION,
      url: `${SITE_URL}/`,
      logo: { '@id': logoId },
      image: { '@id': primaryImageId },
      telephone: '+33698613683',
      email: content.site.email,
      foundingDate: '2025-10-24',
      identifier: [
        {
          '@type': 'PropertyValue',
          propertyID: 'SIREN',
          value: '992839837',
        },
        {
          '@type': 'PropertyValue',
          propertyID: 'SIRET',
          value: '99283983700018',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '178 Avenue Henri Barbusse',
        postalCode: '93700',
        addressLocality: 'Drancy',
        addressRegion: 'Île-de-France',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '48.9216460530455',
        longitude: '2.45525177665886',
      },
      areaServed: serviceAreas,
      knowsLanguage: 'fr-FR',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'service client et devis',
        telephone: '+33698613683',
        email: content.site.email,
        availableLanguage: 'fr-FR',
        areaServed: 'Île-de-France',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Prestations de nettoyage professionnel',
        itemListElement: offers,
      },
      sameAs: [
        'https://fr.linkedin.com/in/eclat-brillance-891817412',
      ],
    },
    {
      '@type': 'ImageObject',
      '@id': logoId,
      url: `${SITE_URL}/logo.svg`,
      contentUrl: `${SITE_URL}/logo.svg`,
      width: 452,
      height: 452,
      caption: `Logo ${SITE_NAME}`,
    },
    {
      '@type': 'ImageObject',
      '@id': primaryImageId,
      url: `${SITE_URL}/og-eclat-brillance.png`,
      contentUrl: `${SITE_URL}/og-eclat-brillance.png`,
      width: 1200,
      height: 630,
      caption: `${SITE_NAME} — Entreprise de nettoyage à Paris et en Île-de-France`,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: 'Eclat Brillance',
      inLanguage: 'fr-FR',
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebPage',
      '@id': homepageId,
      url: `${SITE_URL}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: { '@id': primaryImageId },
    },
  ],
};

export const legalPageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/mentions-legales#webpage`,
      url: `${SITE_URL}/mentions-legales`,
      name: LEGAL_TITLE,
      description: LEGAL_DESCRIPTION,
      inLanguage: 'fr-FR',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      breadcrumb: { '@id': `${SITE_URL}/mentions-legales#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/mentions-legales#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Mentions légales et confidentialité',
          item: `${SITE_URL}/mentions-legales`,
        },
      ],
    },
  ],
};

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
