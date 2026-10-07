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

// Add image paths here when the style reference photos are ready.
export const STYLE_OPTION_IMAGES = {};

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
