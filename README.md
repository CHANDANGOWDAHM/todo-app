# todo-app
todolist
# Todo APP

A small, accessible, single-page Todo application built with plain HTML, CSS and JavaScript. Todos persist in the browser using `localStorage` and you can add, edit, complete, filter and remove items.

I've created this README describing the project, how to run it, key features, and implementation notes.

---

## Features

- Add new todos
- Edit existing todos (double-click label or click Edit)
- Toggle complete / active state
- Delete todos
- Filter views: All, Pending (active), Completed
- Clear all completed todos
- Persistent storage using `localStorage` (`STORAGE_KEY = 'todos-v1'`)
- Keyboard support:
  - Enter to submit new todo
  - Enter to save edits, Escape to cancel edits
- Basic accessibility:
  - ARIA attributes (`aria-label`, `role="tablist"`, `aria-live="polite"`)
  - Focusable labels for keyboard users

---

## Files

- `index.html` — markup for the app
- `styles.css` — styling (variables, responsive layout)
- `script.js` — application logic:
  - Add / remove / edit todos
  - Persist to `localStorage`
  - Render filtered todo list

---

## Getting started

No build tools or dependencies required.

Option 1 — Open locally:
1. Download the files (`index.html`, `styles.css`, `script.js`) into a folder.
2. Double-click `index.html` or open it in your browser (`File > Open`).

Option 2 — Serve with a simple local server (recommended for service-worker compatibility or proper file loading):
- Python 3
  ```bash
  python -m http.server 8000
  # then open http://localhost:8000
  ```
- Node (using `http-server`)
  ```bash
  npx http-server -p 8000
  # then open http://localhost:8000
  ```

---

## How it works (implementation notes)

- The app stores todos in `localStorage` under the key `todos-v1`.
- Todos are represented as objects:
  ```js
  {
    id: "unique-id",
    text: "Todo text",
    completed: false,
    createdAt: 1670000000000
  }
  ```
- The UI is rendered from the `todos` array each time it changes.
- Filtering is done client-side by the `filter` variable (`all | active | completed`).
- Editing an item replaces the list item node with an inline input + Save / Cancel controls, and saves on Enter.

Important constants and behavior:
- `STORAGE_KEY = 'todos-v1'`
- `uid()` uses `Date.now()` + random base-36 suffix for unique ids
- Empty or whitespace-only todos are ignored

---

## Accessibility & UX

- Uses ARIA where helpful (e.g. `aria-live="polite"` on the todo list container so screen readers announce updates).
- Controls are focusable and keyboard operable:
  - The todo input accepts Enter to add.
  - Edit input uses Enter to save and Escape to cancel.
- Contrast and focus styles are present for clarity; consider further tuning for WCAG compliance if needed.

---

## Customization

- Theme variables are defined in `:root` (colors like `--bg`, `--card`, `--accent`, `--danger`) and can be updated in `styles.css`.
- To change persistence behaviour (e.g., use a backend), replace the `save()` and `load()` implementations in `script.js`.

---

## Known limitations & possible improvements

- No undo for deletes or completed-clear
- No backend sync — todos remain only in the browser's `localStorage`
- No animations for add/remove
- Duplicate detection is not enforced
- Consider adding:
  - Drag-and-drop reordering
  - Unit tests
  - Multi-device sync (via a backend)
  - Dark theme toggle

---

## Contributing

This is a simple example project — feel free to fork and submit improvements:
- Fixes and enhancements via PR
- Add tests and CI
- Improve accessibility and mobile UX

---

## License

MIT License — use and modify freely.

---
