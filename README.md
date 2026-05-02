# Single-Page-Application-SPA- follows modern web development practices

This project is a simple Single Page Application (SPA) built with HTML, CSS, and JavaScript.

## Features

- Dynamic navigation without page reloads
- Event listeners for buttons and form submission
- Fetch requests to external APIs for live data
- DOM updates to render quotes, todos, and API responses

## Files

- `index.html` — page structure and content templates
- `styles.css` — app styling and responsive layout
- `script.js` — SPA routing, event listeners, fetch calls, and DOM manipulation

## Features added

- `Dictionary` page for word searches with pronunciation, definitions, and synonyms
- graceful handling of missing pronunciation or synonym data
- validation for empty and invalid search queries

## How to use

1. Open `index.html` in your browser.
2. Click the navigation buttons to switch between sections.
3. Use the "Load an Inspirational Quote" button to fetch a quote from an API.
4. Use the "Fetch Todos" button to load a list of todos.
5. Submit the form on the Create Post page to send a POST request and view the response.

## View and fork on GitHub

1. Visit the repository page:
   - `https://github.com/shamzy254/Single-Page-Application-SPA-`
2. Click the `Fork` button in the top-right corner to create your own copy.
3. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/Single-Page-Application-SPA-.git
cd Single-Page-Application-SPA-
```

4. Install dependencies:

```bash
npm install
```

5. Start the local server:

```bash
npm start
```

6. Open the URL shown in your terminal (usually `http://127.0.0.1:5000`) in your browser.

## Local development workflow

- Edit `index.html`, `styles.css`, or `script.js`.
- Save your changes.
- Refresh your browser to see updates.
- If you want to keep your fork synced with the original repository, add the upstream remote:

```bash
git remote add upstream https://github.com/shamzy254/Single-Page-Application-SPA-.git
git fetch upstream
git merge upstream/main
```
