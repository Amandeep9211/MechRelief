# MechRelief
Repairs wherever you are. FYP - on-demand car service platform.

| Folder | What it is | Run |
|---|---|---|
| `customer-app/` | Expo / React Native app (customer + mechanic) | `cd customer-app && npm install && npx expo start -c` |
| `admin-panel/` | React web admin panel | `cd admin-panel && npm install && npm run dev` |
| `backend/` | Spring Boot API (coming later) | - |

## Team rules
1. Never work directly on `main`. Make a branch: `git checkout -b feature/your-task`.
2. Run `git pull` before you start working.
3. Small commits with clear messages.
4. Never push `.env`, passwords, API keys, `node_modules`.
