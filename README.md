# Deploy on Railway
1. Domain already set to semaglutide.up.railway.app (index.html, robots.txt, sitemap.xml).
2. Push this folder to GitHub, then Railway > New Project > Deploy from GitHub repo (Railway detects Node and runs `npm start`).
3. Service > Settings > Networking > Generate Domain (or add a custom domain).
4. Google Search Console: add the property, submit `/sitemap.xml`, then URL Inspection > Request Indexing.
