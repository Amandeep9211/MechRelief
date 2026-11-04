// Saara DUMMY data ek jagah. Backend step mein ye file hat jayegi aur har cheez API se aayegi.

export const USER = {
  name: 'Ahmed Khan',
  phone: '0300 1234567',
  car: 'Honda Civic 2018',
  trusted: { name: 'Usman Khan', phone: '0321 7654321' },
};

export const WORKER_FOR = {
  fuel: { name: 'Bilal Hussain', phone: '0301 2345678', code: 'Wor112', rating: 4.6, jobs: 98, role: 'Fuel Delivery Rider' },
  battery: { name: 'Saad Ahmed', phone: '0302 3456789', code: 'Wor231', rating: 4.7, jobs: 143, role: 'Battery Vendor' },
  tyre: { name: 'Imran Shah', phone: '0303 4567890', code: 'Wor318', rating: 4.5, jobs: 120, role: 'Tyre Specialist' },
  towing: { name: 'Farhan Ali', phone: '0304 5678901', code: 'Wor404', rating: 4.9, jobs: 76, role: 'Tow Operator' },
  inspection: { name: 'Kamran Malik', phone: '0305 6789012', code: 'Wor519', rating: 4.9, jobs: 64, role: 'Inspector' },
  default: { name: 'Ali Raza', phone: '0333 5551234', code: 'Wor567', rating: 4.8, jobs: 214, role: 'General Mechanic' },
};
export const workerFor = (catId) => WORKER_FOR[catId] ?? WORKER_FOR.default;

// Demo mein is category ka worker "busy" dikhta hai, to request queue mein jati hai.
export const BUSY_CATEGORIES = ['towing'];

export const DEMO_JOB_CODE = '4827';

export const PAST_BOOKINGS = [
  { id: 'MR-1042', categoryId: 'general', title: 'General Repair', status: 'completed', date: '24 Oct 2026, 4:10 PM', worker: 'Ali Raza', total: 2084, car: 'Honda Civic 2018', location: 'Gulberg III, Lahore', rating: 5, detail: 'Brakes' },
  { id: 'MR-1038', categoryId: 'battery', title: 'Battery Assistance', status: 'completed', date: '16 Oct 2026, 9:40 AM', worker: 'Saad Ahmed', total: 17484, car: 'Honda Civic 2018', location: 'DHA Phase 5, Lahore', rating: 4, detail: 'Buy new' },
  { id: 'MR-1031', categoryId: 'inspection', title: 'Car Inspection', status: 'completed', date: '02 Oct 2026, 1:15 PM', worker: 'Kamran Malik', total: 5384, car: 'Toyota Corolla 2015', location: 'Model Town, Lahore', rating: 5, detail: 'Car', hasReport: true },
  { id: 'MR-1027', categoryId: 'towing', title: 'Towing', status: 'cancelled', date: '28 Sep 2026, 11:30 PM', worker: 'Farhan Ali', total: 3076, car: 'Honda Civic 2018', location: 'Johar Town, Lahore', detail: 'Cancelled while in queue', refund: 462 },
];

export const NOTIFICATIONS = [
  { id: 'n1', icon: 'car-wrench', title: 'Worker is on the way', body: 'Ali Raza is heading to your location. ETA 12 min.', time: '2 min ago', unread: true },
  { id: 'n2', icon: 'check-decagram-outline', title: 'Booking confirmed', body: 'Your request MR-1043 is confirmed. Job code: 4827.', time: '14 min ago', unread: true },
  { id: 'n3', icon: 'cash-check', title: 'Advance payment received', body: 'We received your 15% advance of Rs 283 via JazzCash.', time: '15 min ago', unread: false },
  { id: 'n4', icon: 'star-outline', title: 'Rate your last service', body: 'How was your battery service with Saad Ahmed?', time: '2 days ago', unread: false },
];

export const INSPECTION_REPORT = {
  bookingId: 'MR-1031', car: 'Toyota Corolla 2015', date: '02 Oct 2026', inspector: 'Kamran Malik', score: 82,
  verdict: 'Good condition, minor issues found',
  items: [
    { name: 'Engine & transmission', status: 'ok', note: 'Smooth idle, no leaks, gear shifts normal.' },
    { name: 'Brakes', status: 'attention', note: 'Front pads at about 30%. Replace within 3 months.' },
    { name: 'Suspension & steering', status: 'ok', note: 'No play or noise found.' },
    { name: 'Tyres & wheels', status: 'attention', note: 'Rear tyres worn unevenly. Alignment advised.' },
    { name: 'Electrical & lights', status: 'ok', note: 'All lights and windows working.' },
    { name: 'Body, paint & accident signs', status: 'ok', note: 'No accident repair signs. Small scratch on rear bumper.' },
    { name: 'Interior & AC', status: 'ok', note: 'AC cooling well. Seats in good shape.' },
  ],
};

// ---------- Mechanic (worker) side ----------
export const WORKER = {
  name: 'Ali Raza', code: 'Wor567', role: 'General Mechanic', phone: '0333 5551234', rating: 4.8, jobs: 214,
  cnicVerified: true, categories: ['General Repair', 'Electrical Repair'], joined: 'Mar 2026',
};

export const WORKER_STATS = { todayJobs: 3, todayEarning: 6400, weekEarning: 28900, rating: 4.8 };

export const WORKER_REQUEST = {
  id: 'MR-1044', customer: 'Hassan Ahmed', phone: '0312 9876543', categoryId: 'general', title: 'General Repair', issue: 'Engine problem',
  note: 'Car is not starting, stuck near the market.', car: 'Suzuki Cultus 2016', location: 'Model Town, Lahore',
  km: 4.2, emergency: true, service: 1500, distance: 252, total: 1752, advance: 263, cash: 1489,
};

export const WORKER_QUEUE = [
  { id: 'MR-1045', customer: 'Sana Iqbal', phone: '0321 1112233', title: 'General Repair', issue: 'Brakes', emergency: false, wait: 'Waiting 8 min', car: 'Toyota Yaris 2020' },
  { id: 'MR-1046', customer: 'Zain Abbas', phone: '0345 4445566', title: 'Electrical Repair', issue: 'Starter / alternator', emergency: false, wait: 'Waiting 3 min', car: 'Honda City 2019' },
];

export const WORKER_HISTORY = [
  { id: 'MR-1040', title: 'General Repair', customer: 'Faisal Raza', date: 'Today, 10:20 AM', earning: 2084, rating: 5 },
  { id: 'MR-1039', title: 'Electrical Repair', customer: 'Nida Khan', date: 'Today, 8:05 AM', earning: 1584, rating: 5 },
  { id: 'MR-1036', title: 'General Repair', customer: 'Omar Sheikh', date: 'Yesterday, 6:30 PM', earning: 2284, rating: 4 },
  { id: 'MR-1033', title: 'General Repair', customer: 'Hira Tariq', date: 'Yesterday, 1:10 PM', earning: 1884, rating: 5 },
  { id: 'MR-1029', title: 'Electrical Repair', customer: 'Adeel Mirza', date: '27 Oct, 5:45 PM', earning: 1484, rating: 4 },
];
