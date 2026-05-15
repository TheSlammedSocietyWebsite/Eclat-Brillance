/**
 * Bibliothèque d'icônes SVG prédéfinies pour les prestations.
 * Chaque icône a un nom lisible et un path SVG (viewBox 0 0 24 24).
 */
export const ICON_LIBRARY = [
  {
    id: 'bureau',
    name: 'Bureau / Ordinateur',
    paths: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M8 14h2"/><path d="M14 14h2"/>',
  },
  {
    id: 'immeuble',
    name: 'Immeuble / Bâtiment',
    paths: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/>',
  },
  {
    id: 'commerce',
    name: 'Commerce / Boutique',
    paths: '<path d="M3 7h18l-2 13H5L3 7z"/><path d="M8 7V4a4 4 0 0 1 8 0v3"/>',
  },
  {
    id: 'travaux',
    name: 'Travaux / Outils',
    paths: '<path d="M14 3l7 7-11 11H3v-7L14 3z"/><path d="M13 4l7 7"/>',
  },
  {
    id: 'vitre',
    name: 'Vitre / Fenêtre',
    paths: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 9h16"/><path d="M4 15h16"/><path d="M12 3v18"/>',
  },
  {
    id: 'remise-etat',
    name: 'Remise en état / Maison',
    paths: '<path d="M3 12l4-8 5 8 5-8 4 8"/><path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>',
  },
  {
    id: 'aspirateur',
    name: 'Aspirateur / Ménage',
    paths: '<path d="M12 2a4 4 0 0 1 4 4v2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="14" r="2"/>',
  },
  {
    id: 'spray',
    name: 'Spray / Produit',
    paths: '<path d="M12 2v4"/><path d="M9 6h6l-1 4H10z"/><path d="M11 10v8a2 2 0 0 0 4 0v-1"/><path d="M8 14a4 4 0 0 0 8 0"/>',
  },
  {
    id: 'poubelle',
    name: 'Poubelle / Recyclage',
    paths: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  },
  {
    id: 'check',
    name: 'Check / Validation',
    paths: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  },
  {
    id: 'etincelle',
    name: 'Étincelle / Brillance',
    paths: '<path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z"/>',
  },
  {
    id: 'horloge',
    name: 'Horloge / Rapidité',
    paths: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
];

export function getIconByPaths(paths) {
  return ICON_LIBRARY.find((icon) => icon.paths === paths) || null;
}

export function getIconById(id) {
  return ICON_LIBRARY.find((icon) => icon.id === id) || null;
}
