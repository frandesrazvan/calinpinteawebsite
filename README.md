# calinpintea.ro — replica + 4 design drafts

Working draft, not for public hosting. Open `index.html` in a browser (double-click works, no server needed).
Every page has a **Design** button in the bottom-left corner that switches to the same page in another design.

## Structure

| Folder / file | What it is |
|---|---|
| `index.html`, `interviuri.html`, `carte.html`, `Simpozioane.html`, `contact.html`, `interviuri/` | Replica of the live site (same HTML, CSS and JS as calinpintea.ro) |
| `candela/` | Design A · Candelă (dark, gold) |
| `glas/` | Design B · Glas (typographic, navy + red) |
| `clasic/` | Design C · Clasic (green) |
| `modern/` | Design D · Modern (burgundy) |
| `imagini/` | Gallery photos taken from the live site (re-encoded to WebP, max 1200 px) |
| `media/` | Book covers and author portrait |
| `assets/switcher.js` | The design switcher (remove before going live) |
| `assets/site.js`, `assets/site.css` | Shared behaviour and layout for the 4 new designs |
| `<design>/theme.css` | Colours and fonts for each design |

Each new design has: `index.html` (home), `evenimente.html` (launches + symposia, with photo viewer and filter),
`interviuri.html` (list), `interviuri/<slug>.html` (16 reader pages), `contact.html`.

## Differences from the live site (replica only)

- Links on the home page were absolute (`/index.html`); they are relative here so the copy works anywhere.
- Images are WebP copies (max 1200 px) instead of the original JPEGs. File names are numbered (`imagini/004.webp`).
- The contact form cannot reach `send.php`, so it simulates the same result (`contact.html?sent=1` → green message).

## Problems found on the live site (reproduced in the replica)

- **10 of 16 interviews are blank pages.** Files 1, 4, 7, 8, 14, 15, 16 are 0 bytes; files 2, 6, 12 are filled with null bytes.
  Only 3, 5, 9, 10, 11, 17 have text. In the new designs the blank ones show "Textul … va fi adăugat în curând".
- **57 of 125 gallery photos are broken.** 37 don't load at all, 20 load only partly (files cut at exactly 64 / 128 / 256 KB,
  the typical sign of a failed FTP upload). The full list is in `PROBLEME-IMAGINI.txt`. Ask the client for the originals.
- `contact.html` has no "Comandă carte" link in the menu (the other pages do).

## Still to get from the client

Email, phone, social links, next event, the "Trepte spre cer" buy link (Editura Adenium), the "Terapia prin cultură" cover,
one-line descriptions for "Flori de dor" and "Terapia prin cultură", the 10 missing interview texts, a larger portrait.

## Before going live

- Remove `<script src=".../assets/switcher.js">` from every page.
- Connect the contact form (`form[data-demo-form]` in the new designs) to a real backend, e.g. the existing `send.php`.
