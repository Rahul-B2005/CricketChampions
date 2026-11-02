// Team kits for all 10 nations. Colours only — no logos, crests or sponsor marks.
export const KITS = {
  IND: { shirt: '#1766d6', trim: '#ff9a2e', pants: '#1766d6' },
  AUS: { shirt: '#f2c300', trim: '#0b6b3a', pants: '#0b6b3a' },
  ENG: { shirt: '#1b3f94', trim: '#e8eefc', pants: '#1b3f94' },
  PAK: { shirt: '#0f7a3a', trim: '#e9f5ee', pants: '#0f7a3a' },
  SA:  { shirt: '#0d7a47', trim: '#f2c300', pants: '#0d7a47' },
  NZ:  { shirt: '#15181c', trim: '#e8e8e8', pants: '#15181c' },
  SL:  { shirt: '#1a3a8a', trim: '#f2b705', pants: '#1a3a8a' },
  BAN: { shirt: '#0b7a3e', trim: '#d8262f', pants: '#0b7a3e' },
  AFG: { shirt: '#1c58c9', trim: '#e8f0ff', pants: '#1c58c9' },
  WI:  { shirt: '#7a1d2e', trim: '#f2c300', pants: '#7a1d2e' },
};
export const kitFor = (team) =>
  KITS[team?.code] || { shirt: team?.accent || '#1d7f52', trim: '#ffffff', pants: '#e8efe9' };

export const SKINS = ['#5a3522', '#6f4329', '#8d5a3b', '#a8704a', '#c68a62', '#e0ac82'];
export const HAIR = ['#14100e', '#2a1a12', '#3b2a1c', '#14100e'];
export const hashStr = (s = '') => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

export const shade = (hex = '#1d7f52', amt = 0.45) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  const f = (c) => Math.max(0, Math.round(c * (1 - amt)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
