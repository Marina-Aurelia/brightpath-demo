# Publish BrightPath on GitHub Pages

The project is ready for GitHub Pages. The workflow in `.github/workflows/deploy-pages.yml`
publishes the `static/` folder every time `main` is updated.

## One-time GitHub setup

1. Sign in at [GitHub](https://github.com/).
2. Choose **New repository** and name it `brightpath-demo`.
3. Choose **Public** so people can view the site.
4. Do not initialise the repository with a README, `.gitignore`, or licence.
5. Create the repository and copy its HTTPS URL. It will look like
   `https://github.com/YOUR-USERNAME/brightpath-demo.git`.

## Upload the source

Open PowerShell in this project folder and run these commands, replacing the URL:

```powershell
git init
git branch -M main
git add .
git commit -m "Publish BrightPath learning demo"
git remote add origin https://github.com/YOUR-USERNAME/brightpath-demo.git
git push -u origin main
```

GitHub may open a browser or ask for a personal access token. Complete that sign-in
in your own GitHub account.

## Enable the site

1. In the repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for “Deploy BrightPath demo to GitHub Pages”
   to complete successfully.
4. The green deployment job displays the public URL. It is usually:
   `https://YOUR-USERNAME.github.io/brightpath-demo/`

## Important demo limitation

GitHub Pages hosts static files only. The visual demo, language switching and
offline AI-Tutor fallback work online. The Rust `/api/tutor` endpoint is not
hosted by Pages; hosting a real AI Tutor needs a separate backend and API key.
