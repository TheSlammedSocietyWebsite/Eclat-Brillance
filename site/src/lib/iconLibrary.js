/**
 * Bibliothèque d'icônes SVG prédéfinies pour les prestations.
 * Chaque icône a un nom lisible et un path SVG (viewBox 0 0 24 24).
 */
export const ICON_LIBRARY = [
  {
    id: 'bureau',
    name: 'Bureau',
    paths: '<rect x="2" y="12" width="20" height="8" rx="1"/><rect x="6" y="3" width="12" height="9" rx="1"/><rect x="11" y="12" width="2" height="3"/>',
  },
  {
    id: 'immeuble',
    name: 'Immeuble',
    paths: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>',
  },
  {
    id: 'commerce',
    name: 'Boutique',
    paths: '<path d="M3 7h18l-2 13H5L3 7z"/><path d="M8 7V4a4 4 0 0 1 8 0v3"/>',
  },
  {
    id: 'travaux',
    name: 'Travaux',
    paths: '<path d="M11 21V8"/><rect x="3" y="6" width="18" height="5" rx="1"/>',
  },
  {
    id: 'vitre',
    name: 'Vitres',
    paths: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16"/><path d="M4 15h16"/><path d="M12 3v18"/>',
  },
  {
    id: 'remise-etat',
    name: 'Entrepôt',
    paths: '<path d="M3 12l4-8 5 8 5-8 4 8"/><path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>',
  },
  {
    id: 'spray',
    name: 'Produit',
    paths: '<rect x="9" y="8" width="6" height="12" rx="2"/><rect x="10" y="4" width="4" height="4"/><path d="M9 10H6"/><path d="M14 6h4"/>',
  },
  {
    id: 'poubelle',
    name: 'Poubelle',
    paths: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  },
  {
    id: 'check',
    name: 'Validation',
    paths: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  },
  {
    id: 'etincelle',
    name: 'Brillance',
    paths: '<path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"/>',
  },
  {
    id: 'horloge',
    name: 'Rapidité',
    paths: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
];

export function getIconByPaths(paths) {
  return ICON_LIBRARY.find((icon) => icon.paths === paths) || null;
}

export function getIconById(id) {
  return ICON_LIBRARY.find((icon) => icon.id === id) || null;
}
