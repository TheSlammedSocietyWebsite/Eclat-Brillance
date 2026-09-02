import content from '../../public/content.json';

const serviceAreas = [
  'Paris (75)',
  'Hauts-de-Seine (92)',
  'Seine-Saint-Denis (93)',
  'Val-de-Marne (94)',
  "Val-d'Oise (95)",
  'Yvelines (78)',
  'Essonne (91)',
  'Seine-et-Marne (77)',
];

export const cleaningServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CleaningService',
  '@id': 'https://www.eclatbrillance.com/#organization',
  name: 'Éclat Brillance',
  legalName: 'Stacy COMPAN (Éclat Brillance EI)',
  url: 'https://www.eclatbrillance.com/',
  logo: 'https://www.eclatbrillance.com/logo.svg',
  image: 'https://www.eclatbrillance.com/og-eclat-brillance.png',
  telephone: '+33698613683',
  email: content.site.email,
  description: "Entreprise de nettoyage professionnelle intervenant à Paris et dans toute l'Île-de-France. Entretien de bureaux, immeubles, commerces, fin de chantier et vitres.",
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Virement bancaire, Chèque',
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
    latitude: 48.9275,
    longitude: 2.4475,
  },
  areaServed: serviceAreas.map((name) => ({
    '@type': 'AdministrativeArea',
    name,
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '20:00',
    },
  ],
  serviceType: content.prestations.map(({ title }) => title),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations de nettoyage professionnel',
    itemListElement: content.prestations.map(({ title, body }) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: title,
        description: body,
      },
    })),
  },
  sameAs: [],
};

export const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: content.faq.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
