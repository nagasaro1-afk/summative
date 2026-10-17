# Student Finance Tracker

**Theme:** Student Finance Tracker
**Live site:** https://naasaro1-afk.github.io/summative/
**Demo video:** (paste unlisted link here)

Made by Agasaro Nicia Greta - GitHub: nagasaro1-afk - n.agasaro1@alustudent.com

## FEATURES
- About, Dashboard, Add Record form ,Records table and Settings sections
- Add, inline edit and delete records (with confirm on delete)
- Sort by date, description or amount
- Live regex search with a case-insensitive toggle and highlighted matches
-Dashboard: total records, total spent, top category, last 7 days chart
- Spending cap with ARIA live message (polite when under, assertive when over)
- Currency settings: USD base, EUR and RWF wwith maual rates
- Saves automatically to localStorage
- Import / export JSON (the file is checked before loading)
- Responsive layout (360px, 768px, 1024px)

## Regex catalog
| Where | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Bus pass" ok, "Bus pass" fails |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | "12.50" ok, "012" fails |
| Date | `^\d{4}-([1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | "2026-10-12" ok |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Fast-food" ok, "Food2" fails |
| Duplicate word (advanced, back-reference) | `\b(\w+)\s+\1\b` | "the the book is rejected |
| Rate | `^\d+(\.\d+)?$` | "0.92" ok |

Search examples: '\.\d{2}\b` (cents), `(coffee|tea)`, `\b(\w+)\s+\1\b`

## Keyboard map 
- Tab / Shift+Tab: move between links, inputs and buttons
- Enter: submit a form or press a button
- First Tab on the page: "Skip to content" link
- Arrow keys: change the value in the sort dropdown

## Accessibility notes
- Semantic landmarks: header, nav, main, section, footer
- Every input has a label, focus is visile (orange outline)
- Status messages use role="status", cap messages use aria-live
- Errors are shown in text next to each field, not only with colour
- Works with keyboard only

## How to run
Open the folder with Vs Code and open `index.html`.
To run the tets open `tests.html` the same way. Every line should say PASS.