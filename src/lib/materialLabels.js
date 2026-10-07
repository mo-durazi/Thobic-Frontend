export const MATERIAL_OPTIONS = {
  texture: [
    { value: 'smooth', label: 'Smooth' },
    { value: 'rough', label: 'Rough' },
  ],
  pattern: [
    { value: 'plain', label: 'Plain' },
    { value: 'patterned', label: 'Patterned' },
  ],
  season: [
    { value: 'summer', label: 'Summer' },
    { value: 'winter', label: 'Winter' },
    { value: 'spring', label: 'Spring' },
    { value: 'all_seasons', label: 'All seasons' },
  ],
  stand: [
    { value: 'stand', label: 'Stand' },
    { value: 'half_stand', label: 'Half stand' },
    { value: 'loose', label: 'Loose' },
  ],
};

export const getMaterialLabel = (field, value) =>
  MATERIAL_OPTIONS[field]?.find((option) => option.value === value)?.label ??
  value;
