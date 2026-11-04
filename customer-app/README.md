# MechRelief — Customer App (React Native + Expo)

## Chalane ka tareeqa
1. Node.js (LTS) install karo.
2. Is folder mein terminal kholo:
   npm install
   npx expo start
3. Phone mein **Expo Go** app install karo (Play Store / App Store) aur terminal wala QR code scan karo.
   (Phone aur laptop ek hi WiFi par hon.)

## Folder structure
src/app/            -> screens (har file = ek screen, Expo Router)
  _layout.js        -> poori app ka frame
  index.js          -> Welcome screen
  (tabs)/           -> neeche ki 5 tabs (Home, Bookings, Track, Reviews, Profile)
  book/[category].js-> ek reusable booking screen (sab 12 categories ke liye)
src/constants/      -> theme (colours) aur 12 categories ki list
src/components/     -> dobara use hone wale chhote components

---

## MechRelief frontend (static data) - kahan kya hai

Ye poora frontend hai: customer aur mechanic dono ki screens, dummy data par. Backend abhi nahi jura.

**Customer:** Welcome, Login, Signup (+ OTP verification), Forgot password (phone > OTP > new password), Home, Booking (ek reusable screen), Payment (15% advance), Job Confirmed (job code + queue),
Track (queue > on the way > job code verify > work > cash payment), Rate, SOS, Bookings (Active/Completed/Cancelled),
Booking detail, Inspection report, Profile, Edit profile, Trusted contact, Notifications, Help.

**Mechanic:** Dashboard (availability, new request, queue), Request (acknowledge + ETA), Job (job code, work, cash collect), My Jobs, Profile.

**Demo ke liye:** Track screen ke neeche "DEMO CONTROL" button request ko agle stage par le jata hai (presentation ke liye).
Booking ke liye "Towing" category mein worker "busy" hai, isliye request queue mein jati hai (BUSY_CATEGORIES in `src/data/mock.js`).

### Folder map
- `src/app/` screens (expo-router: file ka naam = screen ka rasta)
- `src/components/ui.js` shared buttons/cards/inputs, `MapPreview.js` (map ki jagah), `Logo.js`, `SplashScreen.js`
- `src/data/categoryConfig.js` har category ke fields + price (backend mein `booking_config` JSON se aayega)
- `src/data/mock.js` saara dummy data
- `src/state/AppState.js` app ki yaaddasht (user, active job, history, mechanic state)

### Backend kaise jurega
Har screen data `useApp()` (AppState) se leti hai. Backend step mein sirf `AppState.js` aur `src/data/*` ki jagah API calls (`src/services/api.js`)
aayengi, screens ka design nahi badlega. Order: categories > login/signup (JWT) > booking + price > payment + job code > queue + worker > SOS/rating.

**OTP demo:** koi SMS nahi jata, demo code `123456` hai (`src/app/verify-otp.js`). Signup mein account OTP verify hone ke baad hi banta hai.

## Latest changes
- Call button: after booking, the customer can call the worker (Track tab) and the mechanic can call the customer (job screen). It opens the phone dialer (`tel:`). Phone numbers are sample data for now.
- Home screen: borders removed from the service tiles, request icon, hero card and status pill.
- Tabs slide left/right when you switch (customer and mechanic tab bars). See `src/components/tabTransition.js`.
