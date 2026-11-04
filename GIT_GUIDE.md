# Git + GitHub guide (Bilal + groupmate)

## One-time setup (only ONE person does steps 1-3)
1. Install Git: https://git-scm.com/downloads  (check: `git --version`)
2. GitHub.com -> New repository -> name `mechrelief` -> Private -> do NOT add README -> Create.
3. Repo -> Settings -> Collaborators -> Add your groupmate's GitHub username.
4. In this folder:
   git config --global user.name "Your Name"
   git config --global user.email "you@gmail.com"
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mechrelief.git
   git push -u origin main

## Groupmate (once)
   git clone https://github.com/YOUR_USERNAME/mechrelief.git
   cd mechrelief/customer-app && npm install     (and admin-panel the same way)

## Daily routine
   git pull                          # get the other person's latest work
   git checkout -b feature/call-button   # new branch for your task
   ... edit files ...
   git status                        # see what changed
   git add .
   git commit -m "Add call button"
   git push -u origin feature/call-button
   -> On GitHub press "Compare & pull request" -> other person reviews -> Merge.
   git checkout main && git pull     # back to main, with the merged work

## Rules
- Do not both edit the same file at the same time (conflicts). Split work: one does customer-app, other does admin-panel/backend.
- Never push node_modules, .env, passwords, API keys (.gitignore already blocks them).
- Commit small and often. Message = what you did.
- If `git pull` says "conflict": open the file, keep the correct lines, delete the <<<<<<< ======= >>>>>>> markers, then `git add .` and `git commit`.
