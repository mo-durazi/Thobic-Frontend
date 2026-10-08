export const STYLE_OPTIONS = {
  nationalti: ['Emirati', 'Saudi', 'Bahraini', 'Kuwaiti', 'Qatari'],
  collar: ['Normal', 'Chinese', 'V-shape', 'V2-shape', 'sticks-shape'],
  placket: ['Hidden', 'hidden-v', 'Normal', 'Normal-v', 'zipper'],
  chestPocket: ['shape1', 'shape2', 'shape3', 'shape4'],
  sidePockect: ['Double', 'sigle'],
  Sleeves: ['Normal', 'Cuff with buttons'],
};

export const STYLE_FIELDS = [
  { name: 'nationalti', label: 'Nationality' },
  { name: 'collar', label: 'Collar' },
  { name: 'placket', label: 'Placket' },
  { name: 'chestPocket', label: 'Chest Pocket' },
  { name: 'sidePockect', label: 'Side Pocket' },
  { name: 'Sleeves', label: 'Sleeves' },
];

// Add image paths here as reference photos become available.
export const STYLE_OPTION_IMAGES = {
  nationalti: {
    Emirati: '/stylePic/Nationaliti/UAE.png',
    Saudi: '/stylePic/Nationaliti/ksa.png',
    Bahraini: '/stylePic/Nationaliti/Bahrain.png',
    Kuwaiti: '/stylePic/Nationaliti/KW.png',
    Qatari: '/stylePic/Nationaliti/qatar.png',
  },
  collar: {
    Normal: '/stylePic/coller/c1%20%281%29.png',
    Chinese: '/stylePic/coller/c2%20%281%29.png',
    'V-shape': '/stylePic/coller/c3.png',
    'V2-shape': '/stylePic/coller/c4.png',
    'sticks-shape': '/stylePic/coller/c5.png',
  },
  placket: {
    Hidden: '/stylePic/placket/p3.png',
    'hidden-v': '/stylePic/placket/p4.png',
    Normal: '/stylePic/placket/p1.png',
    'Normal-v': '/stylePic/placket/p2.png',
    zipper: '/stylePic/placket/p5.png',
  },
  chestPocket: {
    shape1: '/stylePic/chest%20pocket/cp1.png',
    shape2: '/stylePic/chest%20pocket/cp2.png',
    shape3: '/stylePic/chest%20pocket/cp3.png',
    shape4: '/stylePic/chest%20pocket/cp4.png',
  },
  Sleeves: {
    Normal: '/stylePic/sleevs/h1.png',
    'Cuff with buttons': '/stylePic/sleevs/h2.png',
  },
};

export const DEFAULT_STYLE = Object.fromEntries(
  Object.entries(STYLE_OPTIONS).map(([name, options]) => [name, options[0]]),
);

const STYLE_OPTION_LABELS = {
  collar: {
    'V-shape': 'V shape',
    'V2-shape': 'V2 shape',
    'sticks-shape': 'Sticks shape',
  },
  placket: {
    'hidden-v': 'Hidden V',
    'Normal-v': 'Normal V',
    zipper: 'Zipper',
  },
  chestPocket: {
    shape1: 'Shape 1',
    shape2: 'Shape 2',
    shape3: 'Shape 3',
    shape4: 'Shape 4',
  },
  sidePockect: {
    Double: 'Double',
    sigle: 'Single',
  },
};

const STYLE_LABELS = Object.fromEntries(
  STYLE_FIELDS.map(({ name, label }) => [name, label]),
);

export const getStyleFieldLabel = (name) =>
  STYLE_LABELS[name] ?? name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase());

export const getStyleOptionLabel = (field, value) =>
  STYLE_OPTION_LABELS[field]?.[value] ?? value;

export const formatStyleSummary = (style = {}) =>
  Object.entries(style ?? {})
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([field, value]) =>
      `${getStyleFieldLabel(field)}: ${getStyleOptionLabel(field, String(value))}`,
    )
    .join(' · ');
