import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { defaultAnswers, priceFor } from '../data/categoryConfig';
import {
  USER, PAST_BOOKINGS, NOTIFICATIONS, WORKER_REQUEST, WORKER_QUEUE, WORKER_HISTORY, WORKER_STATS,
  BUSY_CATEGORIES, DEMO_JOB_CODE, workerFor,
} from '../data/mock';

// Poori app ki "yaaddasht": user, chalti hui request (job), history, aur mechanic ka state.
// Abhi sab memory mein hai (app band karne par reset). Backend step mein ye API se aayega.
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const fmtNow = () => 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let counter = 1050;

// Demo ke liye pehle se ek chalti hui request (Home design wali "On the Way" card).
const seedJob = () => ({
  id: 'MR-1043', categoryId: 'general', title: 'General Repair', status: 'enroute', etaMin: 12, emergency: false,
  car: USER.car, location: 'Gulberg III, Lahore', answers: { issue: 'engine', notes: '' },
  price: priceFor('general', { issue: 'engine' }), jobCode: DEMO_JOB_CODE, queuePos: 0, waitMin: 0,
  worker: workerFor('general'), createdAt: fmtNow(),
});

export function AppProvider({ children }) {
  const [user, setUser] = useState(USER);
  const [pending, setPending] = useState(null);     // signup ka data jo OTP verify hone tak ruka hai
  const [draft, setDraft] = useState(null);       // booking form ka data (payment tak)
  const [job, setJob] = useState(seedJob());       // customer ki active request
  const [history, setHistory] = useState(PAST_BOOKINGS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // ---- Customer actions ----
  const startDraft = useCallback((categoryId) => {
    setDraft({ categoryId, car: user.car, location: '', emergency: false, answers: defaultAnswers(categoryId) });
  }, [user.car]);

  const createJob = useCallback(() => {
    if (!draft) return null;
    const cat = CATEGORIES.find((c) => c.id === draft.categoryId);
    const busy = BUSY_CATEGORIES.includes(draft.categoryId);
    counter += 1;
    const next = {
      id: `MR-${counter}`, categoryId: draft.categoryId, title: cat.title, status: busy ? 'queued' : 'enroute',
      etaMin: 15, emergency: draft.emergency, car: draft.car, location: draft.location || 'Current location',
      answers: draft.answers, price: draft.price ?? priceFor(draft.categoryId, draft.answers, draft.emergency), jobCode: DEMO_JOB_CODE,
      queuePos: busy ? (draft.emergency ? 1 : 2) : 0, waitMin: busy ? (draft.emergency ? 10 : 25) : 0,
      worker: workerFor(draft.categoryId), createdAt: fmtNow(),
    };
    setJob(next);
    return next;
  }, [draft]);

  const updateJob = useCallback((patch) => setJob((j) => (j ? { ...j, ...patch } : j)), []);

  const cancelJob = useCallback(() => {
    setJob((j) => {
      if (!j) return j;
      const refunded = j.status === 'queued';
      setHistory((h) => [{
        id: j.id, categoryId: j.categoryId, title: j.title, status: 'cancelled', date: fmtNow(), worker: j.worker.name,
        total: j.price.total, car: j.car, location: j.location,
        detail: refunded ? 'Cancelled while in queue' : 'Cancelled after worker was assigned', refund: refunded ? j.price.advance : 0,
      }, ...h]);
      return null;
    });
  }, []);

  const finishJob = useCallback(({ rating, review }) => {
    setJob((j) => {
      if (!j) return j;
      setHistory((h) => [{
        id: j.id, categoryId: j.categoryId, title: j.title, status: 'completed', date: fmtNow(), worker: j.worker.name,
        total: j.price.total, car: j.car, location: j.location, rating, review, detail: 'Completed',
        hasReport: j.categoryId === 'inspection',
      }, ...h]);
      return null;
    });
  }, []);

  const markAllRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))), []);

  // ---- Mechanic (worker) state ----
  const [wAvailable, setWAvailable] = useState(true);
  const [wRequest, setWRequest] = useState(WORKER_REQUEST);   // nayi aayi hui request (acknowledge baaqi)
  const [wQueue, setWQueue] = useState(WORKER_QUEUE);
  const [wJob, setWJob] = useState(null);                      // worker ki chalti hui job
  const [wHistory, setWHistory] = useState(WORKER_HISTORY);
  const [wStats, setWStats] = useState(WORKER_STATS);

  const acceptRequest = useCallback((eta) => {
    setWJob((cur) => cur ?? { ...wRequest, stage: 'enroute', eta });
    setWRequest(null);
  }, [wRequest]);
  const rejectRequest = useCallback(() => setWRequest(null), []);
  const finishWorkerJob = useCallback(() => {
    setWJob((j) => {
      if (!j) return j;
      setWHistory((h) => [{ id: j.id, title: j.title, customer: j.customer, date: fmtNow(), earning: j.total, rating: 5 }, ...h]);
      setWStats((s) => ({ ...s, todayJobs: s.todayJobs + 1, todayEarning: s.todayEarning + j.total, weekEarning: s.weekEarning + j.total }));
      // Queue mein agli request ho to wo naye request ke tor par aa jati hai.
      setWQueue((q) => {
        if (q.length) {
          const [first, ...rest] = q;
          setWRequest({ ...WORKER_REQUEST, id: first.id, customer: first.customer, phone: first.phone, issue: first.issue, car: first.car, emergency: first.emergency });
          return rest;
        }
        return q;
      });
      return null;
    });
  }, []);

  const value = useMemo(() => ({
    user, setUser, pending, setPending, draft, setDraft, startDraft, job, createJob, updateJob, cancelJob, finishJob, history,
    notifications, markAllRead,
    wAvailable, setWAvailable, wRequest, wQueue, wJob, setWJob, wHistory, wStats, acceptRequest, rejectRequest, finishWorkerJob,
  }), [user, pending, draft, job, history, notifications, wAvailable, wRequest, wQueue, wJob, wHistory, wStats,
    startDraft, createJob, updateJob, cancelJob, finishJob, markAllRead, acceptRequest, rejectRequest, finishWorkerJob]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
