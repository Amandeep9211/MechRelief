// Static (sample) data for the admin panel. All of this comes from the Spring Boot + MySQL backend later.
// Dates are generated relative to "now" so the charts always look current.

export const CATEGORIES = [
  { id: 'fuel', title: 'Fuel Delivery', icon: 'Fuel' },
  { id: 'battery', title: 'Battery Assistance', icon: 'BatteryCharging' },
  { id: 'tyre', title: 'Tyre Service', icon: 'CircleDot' },
  { id: 'towing', title: 'Towing', icon: 'Truck' },
  { id: 'tuning', title: 'Car Tuning', icon: 'Gauge' },
  { id: 'carwash', title: 'Car Wash', icon: 'Droplets' },
  { id: 'ac', title: 'AC Service', icon: 'Fan' },
  { id: 'oil', title: 'Oil Change', icon: 'Droplet' },
  { id: 'electrical', title: 'Electrical Repair', icon: 'Zap' },
  { id: 'denting', title: 'Denting & Painting', icon: 'PaintBucket' },
  { id: 'inspection', title: 'Car Inspection', icon: 'ClipboardCheck' },
  { id: 'general', title: 'General Repair', icon: 'Wrench' },
];
export const catTitle = (id) => CATEGORIES.find((c) => c.id === id)?.title ?? id;

// Pricing the admin can edit (service-wise). Mirrors the customer app's categoryConfig.
export const PRICING = {
  fuel: { service: 250, perKm: 60, avgMin: 25, groups: [{ name: 'Fuel rate (Rs / litre)', items: [['Petrol', 285], ['Diesel', 290]] }] },
  battery: { service: 600, perKm: 60, avgMin: 30, groups: [
    { name: 'New battery brands', items: [['AGS', 14500], ['Osaka', 16500], ['Phoenix', 15500]] },
    { name: 'Temporary battery', items: [['Rent per hour', 150]] }] },
  tyre: { service: 450, perKm: 60, avgMin: 35, groups: [
    { name: 'New tyre brands', items: [['Dunlop', 10500], ['Yokohama', 12500], ['General Tyre', 9500]] },
    { name: 'Temporary tyre', items: [['Rent per hour', 200]] },
    { name: 'Puncture repair', items: [['Tubeless puncture', 600], ['Tube type puncture', 400]] }] },
  towing: { service: 0, perKm: 60, avgMin: 90, groups: [{ name: 'Towing charge', items: [['Towing rate per km', 90]] }] },
  tuning: { service: 3500, perKm: 60, avgMin: 120, groups: [] },
  carwash: { service: 900, perKm: 60, avgMin: 60, groups: [{ name: 'Wash packages', items: [['Basic car wash', 900], ['Interior deep clean', 2500], ['Full detailing', 6500]] }] },
  ac: { service: 1800, perKm: 60, avgMin: 75, groups: [{ name: 'AC problems (service charge)', items: [['Not cooling enough', 1800], ['Gas refill', 1200], ['Compressor noise / failure', 2500], ['Bad smell / filter change', 800], ['Water leaking inside', 1500]] }] },
  oil: { service: 600, perKm: 60, avgMin: 45, groups: [
    { name: 'Oil viscosity (4 L)', items: [['0W-20', 6500], ['5W-30', 5800], ['5W-40', 6200], ['10W-40', 5200], ['15W-40', 4200], ['20W-50', 3800]] },
    { name: 'Extras', items: [['Oil filter', 900]] }] },
  electrical: { service: 1500, perKm: 60, avgMin: 60, groups: [{ name: 'Issues (service charge)', items: [['Headlights / indicators', 1200], ['Battery drains overnight', 1800], ['Power windows / central lock', 1500], ['Starter / alternator', 2000], ['Other wiring issue', 1000]] }] },
  denting: { service: 500, perKm: 60, avgMin: 45, groups: [] },
  inspection: { service: 5000, perKm: 60, avgMin: 90, groups: [{ name: 'Inspection fee', items: [['Car', 5000], ['Bike', 2500], ['Trailer', 4000]] }] },
  general: { service: 1800, perKm: 60, avgMin: 60, groups: [{ name: 'Issues (service charge)', items: [['Engine problem', 1500], ['Brakes', 1800], ['Steering', 2000], ['Suspension', 2200], ['Gearbox / clutch', 2500], ['Other / not sure', 1500]] }] },
};

export const SETTINGS = {
  advancePct: 15,
  emergencyCharge: 500,
  defaultPerKm: 60,
  towingPerKm: 90,
  jobCodeLength: 4,
  otpExpiryMin: 5,
  cashConfirmHours: 12,
  queueEmergencyFirst: true,
  smsOnSos: true,
};

const AREAS = ['Gulberg III', 'DHA Phase 5', 'Johar Town', 'Model Town', 'Bahria Town', 'Wapda Town', 'Cantt', 'Iqbal Town', 'Garden Town', 'Township'];

const WORKER_NAMES = ['Ali Raza', 'Usman Tariq', 'Bilal Ahmed', 'Hamza Sheikh', 'Imran Khan', 'Faisal Mehmood', 'Zeeshan Ali', 'Kamran Butt', 'Adeel Hussain', 'Rizwan Malik', 'Shahid Iqbal', 'Naveed Anwar', 'Asif Javed', 'Talha Saeed'];
const WORKER_CATS = ['general', 'fuel', 'battery', 'tyre', 'towing', 'tuning', 'carwash', 'ac', 'oil', 'electrical', 'denting', 'inspection', 'fuel', 'towing'];
const WORKER_STATUS = ['busy', 'online', 'online', 'busy', 'busy', 'online', 'offline', 'online', 'online', 'offline', 'online', 'busy', 'online', 'online'];

export const WORKERS = WORKER_NAMES.map((name, i) => ({
  id: `W-${201 + i}`,
  name,
  phone: `03${(10 + i * 3) % 50}${String(1234567 + i * 91357).slice(0, 7)}`,
  categoryId: WORKER_CATS[i],
  area: AREAS[(i * 3) % AREAS.length],
  rating: +(4.2 + ((i * 37) % 8) / 10).toFixed(1),
  jobs: 40 + ((i * 53) % 160),
  experience: 2 + (i % 9),
  status: WORKER_STATUS[i],
  verified: i !== 6 && i !== 9,
  active: i !== 9,
  joined: daysAgo(30 + i * 11),
}));

const CUSTOMER_NAMES = ['Ahmed Khan', 'Sara Malik', 'Hassan Ali', 'Ayesha Noor', 'Omar Farooq', 'Hira Zafar', 'Danish Qureshi', 'Mehwish Raza', 'Saad Bashir', 'Fatima Iqbal', 'Junaid Akhtar', 'Maryam Sadiq', 'Waqas Rehman', 'Nimra Aslam', 'Tahir Mahmood', 'Sana Tariq'];
const CARS = ['Honda Civic 2018', 'Toyota Corolla 2020', 'Suzuki Cultus 2019', 'Toyota Yaris 2021', 'Honda City 2017', 'Suzuki Alto 2022', 'KIA Sportage 2021', 'Honda BR-V 2019'];

export const CUSTOMERS = CUSTOMER_NAMES.map((name, i) => ({
  id: `C-${101 + i}`,
  name,
  phone: `03${(21 + i * 2) % 50}${String(7654321 - i * 83211).slice(0, 7)}`,
  area: AREAS[(i * 7 + 2) % AREAS.length],
  car: CARS[i % CARS.length],
  joined: daysAgo(10 + i * 9),
  blocked: i === 13,
  trusted: { name: ['Hina', 'Bilal', 'Zara', 'Kashif'][i % 4] + ' ' + name.split(' ')[1], phone: `03${(30 + i) % 50}${String(5550123 + i * 7001).slice(0, 7)}` },
}));

function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }
function minsAgo(n) { return new Date(Date.now() - n * 60000).toISOString(); }

// ---- Bookings ----
const BASE = {
  fuel: [2850, 250], battery: [15500, 600], tyre: [10500, 450], towing: [0, 0], tuning: [0, 3500], carwash: [0, 900],
  ac: [0, 1800], oil: [6700, 600], electrical: [0, 1500], denting: [0, 500], inspection: [0, 5000], general: [0, 1800],
};
const DESCRIPTIONS = {
  fuel: 'Ran out of petrol near the underpass.', battery: 'Car will not start, clicking sound.', tyre: 'Front left tyre punctured.',
  towing: 'Car overheated and stopped, needs towing to workshop.', tuning: 'Engine feels rough at idle.', carwash: 'Full wash before a wedding.',
  ac: 'AC is blowing warm air.', oil: 'Due for oil change, 10W-40 preferred.', electrical: 'Headlights flicker at night.',
  denting: 'Scratch and dent on the rear door.', inspection: 'Buying a used car, need a full check.', general: 'Car shakes at high speed.',
};
const STATUS_ACTIVE = ['queued', 'enroute', 'arrived', 'working', 'payment', 'enroute'];

export const BOOKINGS = Array.from({ length: 52 }, (_, i) => {
  const cat = CATEGORIES[(i * 5 + 3) % CATEGORIES.length].id;
  const cust = CUSTOMERS[(i * 7) % CUSTOMERS.length];
  const workers = WORKERS.filter((w) => w.categoryId === cat);
  const worker = workers[i % workers.length];
  const active = i < 6;
  const status = active ? STATUS_ACTIVE[i] : (i % 11 === 4 ? 'cancelled' : 'completed');
  const emergency = i % 6 === 2;
  const km = +(3 + ((i * 17) % 90) / 10).toFixed(1);
  const towKm = cat === 'towing' ? 5 + ((i * 3) % 12) : 0;
  const [part, base] = BASE[cat];
  const svc = cat === 'towing' ? towKm * 90 : base;
  const perKm = 60;
  const distance = Math.round(km * perKm);
  const emergencyFee = emergency ? 500 : 0;
  const total = part + svc + distance + emergencyFee;
  const advance = Math.round(total * 0.15);
  const created = active ? minsAgo(8 + i * 17) : new Date(Date.now() - (i - 5) * 0.33 * 86400000 - 3600000).toISOString();
  return {
    id: `MR-${1060 - i}`, towKm, customerId: cust.id, workerId: worker.id, categoryId: cat, status, emergency, km,
    area: AREAS[(i * 3 + 1) % AREAS.length], car: cust.car, createdAt: created,
    price: { part, service: svc, distance, emergency: emergencyFee, total, advance, cash: total - advance, perKm },
    description: DESCRIPTIONS[cat], jobCode: String(1000 + ((i * 7919) % 9000)),
    rating: status === 'completed' ? [5, 5, 4, 5, 3, 4, 5, 2][i % 8] : null,
    cashCustomer: status === 'completed', cashWorker: status === 'completed',
    refund: status === 'cancelled' ? (i % 2 ? advance : 0) : 0,
  };
});

// Two completed jobs where one side did not confirm the cash payment -> dispute (proposal: admin gets an alert).
const completed = BOOKINGS.filter((b) => b.status === 'completed');
export const DISPUTES = [
  { id: 'D-03', bookingId: completed[1].id, reason: 'Worker confirmed cash received, customer did not confirm.', raised: minsAgo(60 * 5), status: 'open', note: '' },
  { id: 'D-02', bookingId: completed[5].id, reason: 'Customer says the paid amount was less than the bill.', raised: minsAgo(60 * 30), status: 'open', note: '' },
  { id: 'D-01', bookingId: completed[9].id, reason: 'Customer did not confirm cash payment within 12 hours.', raised: minsAgo(60 * 80), status: 'resolved', note: 'Called both parties, cash was received. Closed.' },
];
[1, 5].forEach((k, n) => { const b = BOOKINGS.find((x) => x.id === completed[k].id); if (n === 0) b.cashCustomer = false; else b.cashWorker = false; });

export const SOS = [
  { id: 'SOS-03', customerId: CUSTOMERS[2].id, bookingId: BOOKINGS[3].id, location: 'Canal Road near Thokar Niaz Baig', time: minsAgo(12), status: 'new', smsSent: true, note: '' },
  { id: 'SOS-02', customerId: CUSTOMERS[7].id, bookingId: BOOKINGS[1].id, location: 'Ferozepur Road, Kalma Chowk', time: minsAgo(60 * 26), status: 'acknowledged', smsSent: true, note: 'Called the customer, worker is on the way.' },
  { id: 'SOS-01', customerId: CUSTOMERS[10].id, bookingId: completed[3].id, location: 'DHA Phase 5, Y Block', time: minsAgo(60 * 24 * 6), status: 'resolved', smsSent: true, note: 'False alarm, customer pressed the button by mistake.' },
];

const REVIEW_TEXT = {
  5: ['Very professional and quick. Fixed it in 20 minutes.', 'Arrived on time and explained everything clearly.', 'Great service, fair price.'],
  4: ['Good work, a little late.', 'Job done well, would book again.'],
  3: ['Okay service but took longer than estimated.'],
  2: ['Worker arrived very late and the price changed on site.'],
};
export const REVIEWS = BOOKINGS.filter((b) => b.rating).map((b, i) => ({
  id: `R-${i + 1}`, bookingId: b.id, customerId: b.customerId, workerId: b.workerId, categoryId: b.categoryId,
  rating: b.rating, text: REVIEW_TEXT[b.rating][i % REVIEW_TEXT[b.rating].length], date: b.createdAt, hidden: false,
}));

const CHECK_ITEMS = ['Engine & transmission', 'Brakes', 'Suspension & steering', 'Tyres & wheels', 'Electrical & lights', 'Body, paint & accident signs', 'Interior & AC'];
const NOTES = ['No leaks, runs smoothly.', 'Pads at 60%, no noise.', 'Slight play in the left tie rod.', 'Tread depth is good, one tyre is 4 years old.', 'All lights working, battery is healthy.', 'Repainted rear bumper, no structural damage.', 'AC cools well, minor seat wear.'];
export const INSPECTIONS = BOOKINGS.filter((b) => b.categoryId === 'inspection' && b.status === 'completed').slice(0, 4).map((b, i) => ({
  id: `IR-${i + 1}`, bookingId: b.id, customerId: b.customerId, workerId: b.workerId, date: b.createdAt,
  items: CHECK_ITEMS.map((name, k) => ({ name, state: (k + i) % 6 === 2 ? 'attention' : 'ok', note: NOTES[k] })),
  verdict: i % 2 ? 'Good condition, minor suspension work needed.' : 'Recommended to buy. No major issues found.',
}));

// ---- Payments (derived from bookings) ----
export const PAYMENTS = BOOKINGS.filter((b) => b.status !== 'queued').flatMap((b, i) => {
  const rows = [{ id: `PAY-${5000 + i * 2}`, bookingId: b.id, type: 'Advance (JazzCash)', amount: b.price.advance, status: b.status === 'cancelled' ? (b.refund ? 'refunded' : 'paid') : 'paid', ref: `JC${(98213 + i * 4177) % 999999}`, date: b.createdAt }];
  if (b.status === 'completed') {
    const ok = b.cashCustomer && b.cashWorker;
    rows.push({ id: `PAY-${5001 + i * 2}`, bookingId: b.id, type: 'Cash (to worker)', amount: b.price.cash, status: ok ? 'confirmed' : 'disputed', ref: '-', date: b.createdAt });
  }
  return rows;
});

export const money = (n) => 'Rs ' + Math.round(n).toLocaleString('en-US');
export const fmtDate = (iso) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
export const fmtDay = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
export const ago = (iso) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
};
export const STATUS_LABEL = { queued: 'In queue', enroute: 'On the way', arrived: 'Arrived', working: 'Working', payment: 'Payment', completed: 'Completed', cancelled: 'Cancelled' };
export const STATUS_TONE = { queued: 'yellow', enroute: 'blue', arrived: 'blue', working: 'orange', payment: 'purple', completed: 'green', cancelled: 'red' };
