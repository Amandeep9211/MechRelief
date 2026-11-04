// Proposal: "config-driven booking screen". Har category ke fields aur price yahan likhe hain,
// aur sirf EK booking screen inhe parh kar apne aap badal jati hai.
// Backend step mein ye poora config MySQL ke JSON column (booking_config) se aayega.
// Saari qeematein SAMPLE hain; asli qeematein admin panel se set hongi.

export const PER_KM = 60;        // distance charge (Rs / km), sample
export const DISTANCE_KM = 6.4;  // sample distance (baad mein Google Maps se aayegi)
export const EMERGENCY_CHARGE = 500; // emergency request par extra charge (sample, admin panel se set hoga)
export const DESCRIPTION_REQUIRED = ['general']; // baaqi sab categories mein description optional hai

export const INSPECTION_CHECKLIST = [
  'Engine & transmission',
  'Brakes',
  'Suspension & steering',
  'Tyres & wheels',
  'Electrical & lights',
  'Body, paint & accident signs',
  'Interior & AC',
];

const o = (value, label, extra = {}) => ({ value, label, ...extra });

const ISSUES_GENERAL = [
  o('engine', 'Engine problem', { service: 1500 }),
  o('brakes', 'Brakes', { service: 1800 }),
  o('steering', 'Steering', { service: 2000 }),
  o('suspension', 'Suspension', { service: 2200 }),
  o('gearbox', 'Gearbox / clutch', { service: 2500 }),
  o('other', 'Other / not sure', { service: 1500 }),
];

const BATTERY_BRANDS = [
  { value: 'ags', label: 'AGS', price: 14500 },
  { value: 'osaka', label: 'Osaka', price: 16500 },
  { value: 'phoenix', label: 'Phoenix', price: 15500 },
];
const BATTERY_RENT_HR = 150;
const TYRE_BRANDS = [
  { value: 'dunlop', label: 'Dunlop', price: 10500 },
  { value: 'yokohama', label: 'Yokohama', price: 12500 },
  { value: 'general', label: 'General Tyre', price: 9500 },
];
const TYRE_RENT_HR = 200;
const PUNCTURE_TYPES = [
  { value: 'tubeless', label: 'Tubeless puncture', price: 600 },
  { value: 'tube', label: 'Tube type puncture', price: 400 },
];
const DENTING_SERVICE = 500;
const TOW_PER_KM = 90; // towing: pickup se drop-off tak ka charge per km (sample)
const OIL_GRADES = [ // 4 litre ki sample qeematein
  { value: '0w20', label: '0W-20', price: 6500 },
  { value: '5w30', label: '5W-30', price: 5800 },
  { value: '5w40', label: '5W-40', price: 6200 },
  { value: '10w40', label: '10W-40', price: 5200 },
  { value: '15w40', label: '15W-40', price: 4200 },
  { value: '20w50', label: '20W-50', price: 3800 },
];

export const CONFIG = {
  fuel: {
    hint: 'Minimum order Rs 1,500. A fuel delivery rider brings the fuel to you.',
    fields: [
      { key: 'fuel', type: 'choice', label: 'Fuel type', default: 'petrol',
        options: [o('petrol', 'Petrol', { sub: 'Rs 285 / litre', rate: 285 }), o('diesel', 'Diesel', { sub: 'Rs 290 / litre', rate: 290 })] },
      { key: 'litres', type: 'stepper', label: 'Quantity (litres)', default: 10, min: 6, max: 40 },
    ],
    price: (a) => ({ part: (a.fuel === 'diesel' ? 290 : 285) * a.litres, service: 250, partLabel: `Fuel (${a.litres} L)` }),
  },

  battery: {
    hint: 'Buy a new battery (pick a brand) or rent a temporary one by the hour.',
    fields: [
      { key: 'mode', type: 'choice', label: 'Option', default: 'buy',
        options: [o('buy', 'Buy new'), o('rent', 'Temporary', { sub: `Rs ${BATTERY_RENT_HR} per hour` })] },
      { key: 'brand', type: 'select', label: 'Battery brand', default: 'ags', showIf: (a) => a.mode === 'buy',
        options: BATTERY_BRANDS.map((b) => o(b.value, b.label, { right: `Rs ${b.price.toLocaleString('en-US')}` })) },
      { key: 'hours', type: 'stepper', label: `Rental time (Rs ${BATTERY_RENT_HR} per hour)`, default: 3, min: 1, max: 72, unit: 'hr', showIf: (a) => a.mode === 'rent' },
    ],
    price: (a) => {
      if (a.mode === 'rent') return { part: BATTERY_RENT_HR * a.hours, service: 600, partLabel: `Temporary battery (${a.hours} hr)` };
      const b = BATTERY_BRANDS.find((x) => x.value === a.brand);
      return { part: b.price, service: 600, partLabel: `Battery (${b.label})` };
    },
  },

  tyre: {
    hint: 'Buy a new tyre, rent a temporary one by the hour, or get a puncture repaired.',
    fields: [
      { key: 'mode', type: 'choice', label: 'Option', default: 'buy',
        options: [o('buy', 'New tyre'), o('rent', 'Temporary', { sub: `Rs ${TYRE_RENT_HR} per hour` }), o('puncture', 'Puncture repair')] },
      { key: 'brand', type: 'select', label: 'Tyre brand', default: 'dunlop', showIf: (a) => a.mode === 'buy',
        options: TYRE_BRANDS.map((b) => o(b.value, b.label, { right: `Rs ${b.price.toLocaleString('en-US')}` })) },
      { key: 'hours', type: 'stepper', label: `Rental time (Rs ${TYRE_RENT_HR} per hour)`, default: 6, min: 1, max: 72, unit: 'hr', showIf: (a) => a.mode === 'rent' },
      { key: 'puncture', type: 'select', label: 'Puncture type', default: 'tubeless', showIf: (a) => a.mode === 'puncture',
        options: PUNCTURE_TYPES.map((b) => o(b.value, b.label, { right: `Rs ${b.price.toLocaleString('en-US')}` })) },
      { key: 'position', type: 'select', label: 'Which tyre?', default: 'fl',
        options: [o('fl', 'Front left'), o('fr', 'Front right'), o('rl', 'Rear left'), o('rr', 'Rear right'), o('spare', 'Spare tyre')] },
    ],
    price: (a) => {
      if (a.mode === 'rent') return { part: TYRE_RENT_HR * a.hours, service: 450, partLabel: `Temporary tyre (${a.hours} hr)` };
      if (a.mode === 'puncture') {
        const p = PUNCTURE_TYPES.find((x) => x.value === a.puncture);
        return { part: p.price, service: 450, partLabel: `Puncture repair (${p.label})` };
      }
      const b = TYRE_BRANDS.find((x) => x.value === a.brand);
      return { part: b.price, service: 450, partLabel: `Tyre (${b.label})` };
    },
  },

  towing: {
    hint: 'The tow operator travels to you (distance charge, same as other services), then tows your car to the drop-off. Towing is charged per km.',
    fields: [
      { key: 'drop', type: 'text', label: 'Drop-off location', placeholder: 'Workshop or home address', icon: 'map-marker-check-outline', default: '' },
      { key: 'towKm', type: 'stepper', label: `Towing distance (Rs ${TOW_PER_KM} per km)`, default: 10, min: 1, max: 100, unit: 'km' },
      { key: 'starts', type: 'toggle', label: 'Does the car start?', sub: 'Tell the operator if the car can be driven onto the truck', default: false },
    ],
    price: (a) => ({ part: 0, service: TOW_PER_KM * a.towKm, serviceLabel: `Towing charge (${a.towKm} km x Rs ${TOW_PER_KM})` }),
  },

  tuning: {
    hint: 'Engine tune-up for smoother running and better mileage.',
    fields: [
      { key: 'svc', type: 'choice', label: 'Service', default: 'tune',
        options: [o('tune', 'Engine tune-up', { sub: 'Rs 3,500' })] },
    ],
    price: () => ({ part: 0, service: 3500 }),
  },

  carwash: {
    hint: 'Pick a wash package. The washer comes to your location.',
    fields: [
      { key: 'svc', type: 'choice', label: 'Package', default: 'basic',
        options: [o('basic', 'Basic car wash', { sub: 'Rs 900' }), o('interior', 'Interior deep clean', { sub: 'Rs 2,500' }), o('detail', 'Full detailing', { sub: 'Rs 6,500' })] },
    ],
    price: (a) => ({ part: 0, service: { basic: 900, interior: 2500, detail: 6500 }[a.svc] }),
  },

  ac: {
    hint: 'Parts for big repairs are confirmed by the mechanic after diagnosis.',
    fields: [
      { key: 'issue', type: 'select', label: 'AC problem', default: 'cooling',
        options: [o('cooling', 'Not cooling enough', { part: 0, service: 1800 }), o('gas', 'Gas refill', { part: 2800, service: 1200 }),
          o('compressor', 'Compressor noise / failure', { part: 0, service: 2500 }), o('smell', 'Bad smell / filter change', { part: 900, service: 800 }),
          o('leak', 'Water leaking inside', { part: 0, service: 1500 })] },
    ],
    price: (a) => {
      const t = { cooling: [0, 1800], gas: [2800, 1200], compressor: [0, 2500], smell: [900, 800], leak: [0, 1500] }[a.issue];
      return { part: t[0], service: t[1], partLabel: t[0] ? 'AC parts / gas' : 'Part cost' };
    },
  },

  oil: {
    hint: 'Pick the oil viscosity for your engine (4 L). Add a new oil filter if you need one.',
    fields: [
      { key: 'viscosity', type: 'select', label: 'Oil viscosity', default: '5w30',
        options: OIL_GRADES.map((g) => o(g.value, g.label, { right: `Rs ${g.price.toLocaleString('en-US')}` })) },
      { key: 'filter', type: 'toggle', label: 'Replace oil filter', sub: '+ Rs 900', default: true },
    ],
    price: (a) => ({ part: OIL_GRADES.find((g) => g.value === a.viscosity).price + (a.filter ? 900 : 0), service: 600, partLabel: 'Oil & filter' }),
  },

  electrical: {
    hint: 'Pick the issue and the mechanic will diagnose it on arrival.',
    fields: [
      { key: 'issue', type: 'select', label: 'Electrical issue', default: 'lights',
        options: [o('lights', 'Headlights / indicators'), o('drain', 'Battery drains overnight'), o('windows', 'Power windows / central lock'), o('starter', 'Starter / alternator'), o('other', 'Other wiring issue')] },
    ],
    price: (a) => ({ part: 0, service: { lights: 1200, drain: 1800, windows: 1500, starter: 2000, other: 1000 }[a.issue] }),
  },

  denting: {
    hint: 'Add photos of the damage. The mechanic inspects it and quotes the final repair price.',
    note: `The Rs ${DENTING_SERVICE} service charge and the distance charge will be adjusted in your final repair bill.`,
    fields: [
      { key: 'area', type: 'select', label: 'Panel', default: 'door',
        options: [o('door', 'Door'), o('bumper', 'Bumper'), o('bonnet', 'Bonnet'), o('roof', 'Roof'), o('full', 'Full panel set')] },
      { key: 'photos', type: 'photos', label: 'Photos of the damage', default: [], max: 4 },
    ],
    price: () => ({ part: 0, service: DENTING_SERVICE, serviceLabel: 'Service charge (adjustable)' }),
  },

  inspection: {
    hint: 'The inspector fills the checklist below and you get a report in the app.',
    fields: [
      { key: 'vehicle', type: 'choice', label: 'Vehicle to inspect', default: 'car',
        options: [o('car', 'Car', { sub: 'Rs 5,000' }), o('bike', 'Bike', { sub: 'Rs 2,500' }), o('trailer', 'Trailer', { sub: 'Rs 4,000' })] },
      { key: 'checklist', type: 'checklist', label: 'What will be checked', items: INSPECTION_CHECKLIST },
    ],
    price: (a) => ({ part: 0, service: { car: 5000, bike: 2500, trailer: 4000 }[a.vehicle], serviceLabel: 'Inspection fee' }),
  },

  general: {
    hint: 'Pick the closest issue and describe the problem below (required). The mechanic confirms the exact work on arrival.',
    fields: [
      { key: 'issue', type: 'select', label: 'Issue type', default: 'engine', options: ISSUES_GENERAL },
    ],
    price: (a) => ({ part: 0, service: ISSUES_GENERAL.find((i) => i.value === a.issue).service }),
  },
};

// Fields ki default values nikalta hai (form ki shuruaati state).
export function defaultAnswers(catId) {
  const out = {};
  (CONFIG[catId]?.fields ?? []).forEach((f) => {
    if (f.type === 'info' || f.type === 'checklist') return;
    out[f.key] = f.default ?? (f.options ? f.options[0].value : '');
  });
  out.notes = ''; // universal "Description" field (har service par)
  return out;
}

// Price breakdown: part cost + service charge + distance charge. 15% advance, 85% cash (proposal).
export function priceFor(catId, answers, emergency = false, km = DISTANCE_KM) {
  const cfg = CONFIG[catId];
  const base = cfg.price(answers);
  const distance = Math.round(km * (cfg.perKm ?? PER_KM));
  const emergencyFee = emergency ? EMERGENCY_CHARGE : 0;
  const total = base.part + base.service + distance + emergencyFee;
  const advance = Math.round(total * 0.15);
  return {
    part: base.part, service: base.service, distance, emergency: emergencyFee, total, advance, cash: total - advance, km,
    partLabel: base.partLabel ?? 'Part cost', serviceLabel: base.serviceLabel ?? 'Service charge', perKm: cfg.perKm ?? PER_KM, note: cfg.note,
  };
}

// Answers ko "Label: value" lines mein badalta hai (summary screens ke liye).
export function describeAnswers(catId, answers) {
  const out = [];
  (CONFIG[catId]?.fields ?? []).forEach((f) => {
    if (f.type === 'info' || f.type === 'checklist') return;
    if (f.showIf && !f.showIf(answers ?? {})) return;
    const v = answers?.[f.key];
    let text;
    if (f.options) text = f.options.find((x) => x.value === v)?.label ?? '-';
    else if (f.type === 'toggle') text = v ? 'Yes' : 'No';
    else if (f.type === 'stepper') text = `${v}${f.unit ? ' ' + f.unit : ''}`;
    else if (f.type === 'photos') text = v?.length ? `${v.length} photo${v.length > 1 ? 's' : ''}` : 'None';
    else text = v || '-';
    out.push({ label: f.label, value: text });
  });
  if (answers?.notes?.trim()) out.push({ label: 'Description', value: answers.notes.trim() });
  return out;
}
