import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, LogIn, Mail, ShieldCheck, Siren, Tags } from 'lucide-react';
import { useStore } from '../store';
import { Btn, Field } from '../ui';

// Demo login + forgot password by email. Backend step: POST /auth/admin/login (JWT),
// POST /auth/admin/forgot-password (email a 6-digit code), POST /auth/admin/reset-password.
const ADMIN_EMAIL = 'admin@mechrelief.pk';
const DEMO_CODE = '123456';

export default function Login() {
  const { login, adminPw, setAdminPw } = useStore();
  const [view, setView] = useState('login'); // login | email | code | reset | done
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const boxes = useRef([]);
  const [secs, setSecs] = useState(0);
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');

  useEffect(() => {
    if (secs <= 0) return undefined;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const go = (v) => { setView(v); setError(''); };

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Please enter your email and password.');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== adminPw) return setError('Incorrect email or password.');
    login(email.trim().toLowerCase());
  };

  const sendCode = (e) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) return setError('No admin account found with this email.');
    setCode(['', '', '', '', '', '']); setSecs(45); go('code');
    setTimeout(() => boxes.current[0]?.focus(), 50);
  };

  const onCode = (i, v) => {
    const d = v.replace(/\D/g, '');
    const nextCode = [...code];
    if (d.length > 1) { d.slice(0, 6).split('').forEach((c, k) => { if (i + k < 6) nextCode[i + k] = c; }); } else nextCode[i] = d;
    setCode(nextCode); setError('');
    const target = Math.min(5, i + Math.max(1, d.length));
    if (d) boxes.current[target]?.focus();
  };
  const onKey = (i, e) => { if (e.key === 'Backspace' && !code[i] && i > 0) boxes.current[i - 1]?.focus(); };

  const verify = (e) => {
    e.preventDefault();
    const c = code.join('');
    if (c.length < 6) return setError('Please enter the 6-digit code.');
    if (c !== DEMO_CODE) return setError('That code is not correct. Please try again.');
    go('reset');
  };

  const reset = (e) => {
    e.preventDefault();
    if (next.length < 6) return setError('Your password must be at least 6 characters long.');
    if (next !== again) return setError('The two passwords do not match.');
    setAdminPw(next); setPassword(''); setNext(''); setAgain(''); go('done');
  };

  return (
    <div className="login">
      <div className="login-hero">
        <div>
          <img className="car" src="./mechrelief-car.png" alt="" />
          <img className="word" src="./mechrelief-wordmark.png" alt="MechRelief" />
        </div>
        <div>
          <h2>Run every job, worker and rupee <span>from one place.</span></h2>
          <ul>
            <li><ShieldCheck size={16} style={{ verticalAlign: -3 }} /> Create and manage verified workers</li>
            <li><Tags size={16} style={{ verticalAlign: -3 }} /> Set service prices and platform charges</li>
            <li><Siren size={16} style={{ verticalAlign: -3 }} /> Respond to SOS alerts and cash disputes</li>
          </ul>
        </div>
        <small style={{ color: '#5d6773' }}>MechRelief · Repairs wherever you are.</small>
      </div>

      <div className="login-box">
        {view === 'login' && (
          <form className="login-form" onSubmit={submit}>
            <h1>Admin Login</h1>
            <p>Sign in to manage the MechRelief platform.</p>
            <Field label="Email">
              <input type="email" placeholder="admin@mechrelief.pk" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoComplete="username" />
            </Field>
            <Field label="Password">
              <div className="pw">
                <input type={show ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} autoComplete="current-password" />
                <button type="button" onClick={() => setShow(!show)} aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </Field>
            <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 14 }}>
              <button type="button" className="link" onClick={() => go('email')}>Forgot password?</button>
            </div>
            {error ? <div className="note red" style={{ marginBottom: 14 }}>{error}</div> : null}
            <Btn type="submit" style={{ width: '100%' }}><LogIn size={17} /> Sign In</Btn>
            <div className="demo"><b>DEMO MODE</b><br />Email: <b>admin@mechrelief.pk</b><br />Password: <b>admin123</b></div>
          </form>
        )}

        {view === 'email' && (
          <form className="login-form" onSubmit={sendCode}>
            <div className="big-ic"><Mail size={30} /></div>
            <h1>Forgot password?</h1>
            <p>Enter your admin email. We will send you a 6-digit code to reset your password.</p>
            <Field label="Email"><input type="email" placeholder="admin@mechrelief.pk" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoFocus /></Field>
            {error ? <div className="note red" style={{ marginBottom: 14 }}>{error}</div> : null}
            <Btn type="submit" style={{ width: '100%' }}>Send Code</Btn>
            <button type="button" className="link back" onClick={() => go('login')}><ArrowLeft size={15} /> Back to login</button>
          </form>
        )}

        {view === 'code' && (
          <form className="login-form" onSubmit={verify}>
            <div className="big-ic"><KeyRound size={30} /></div>
            <h1>Check your email</h1>
            <p>We sent a 6-digit code to <b style={{ color: 'var(--text)' }}>{email.trim().toLowerCase()}</b>.</p>
            <div className="otp">
              {code.map((c, i) => (
                <input key={i} ref={(el) => { boxes.current[i] = el; }} value={c} inputMode="numeric" maxLength={6} aria-label={`Digit ${i + 1}`}
                  onChange={(e) => onCode(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onFocus={(e) => e.target.select()} className={error ? 'err' : ''} />
              ))}
            </div>
            {error ? <div className="note red" style={{ marginBottom: 14 }}>{error}</div> : null}
            <Btn type="submit" style={{ width: '100%' }}>Verify Code</Btn>
            <div style={{ textAlign: 'center', marginTop: 14, color: 'var(--muted)' }}>
              {secs > 0 ? <>Resend code in <b style={{ color: 'var(--text)' }}>0:{String(secs).padStart(2, '0')}</b></> : <button type="button" className="link" onClick={() => sendCode()}>Resend code</button>}
            </div>
            <button type="button" className="link back" onClick={() => go('email')}><ArrowLeft size={15} /> Wrong email? Change it</button>
            <div className="demo"><b>DEMO MODE</b><br />No email is sent in this demo. Use the code <b style={{ color: 'var(--orange)', letterSpacing: 2 }}>{DEMO_CODE}</b>.</div>
          </form>
        )}

        {view === 'reset' && (
          <form className="login-form" onSubmit={reset}>
            <div className="big-ic"><ShieldCheck size={30} /></div>
            <h1>Create a new password</h1>
            <p>Your email is verified. Choose a new password for your admin account.</p>
            <Field label="New password"><input type="password" value={next} onChange={(e) => { setNext(e.target.value); setError(''); }} autoFocus /></Field>
            <Field label="Confirm new password"><input type="password" value={again} onChange={(e) => { setAgain(e.target.value); setError(''); }} /></Field>
            {error ? <div className="note red" style={{ marginBottom: 14 }}>{error}</div> : null}
            <Btn type="submit" style={{ width: '100%' }}>Reset Password</Btn>
          </form>
        )}

        {view === 'done' && (
          <div className="login-form" style={{ textAlign: 'center' }}>
            <div className="big-ic ok"><CheckCircle2 size={34} /></div>
            <h1>Password updated</h1>
            <p>You can now sign in with your new password.</p>
            <Btn style={{ width: '100%' }} onClick={() => go('login')}>Back to Login</Btn>
          </div>
        )}
      </div>
    </div>
  );
}
