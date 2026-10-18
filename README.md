# Student Finance Tracker

**Theme:** Student Finance Tracker
**Live site:** https://nagasaro1-afk.github.io/summative/
**Demo video:** (https://www.youtube.com/watch?v=C3yMe46-IE8)

Made by AGASARO NICIA GRETA - GitHub: nagasaro1-afk - n.agasaro1@alustudent.com


## WHAT THE APP DOES 

It's a spending tracker for students.You add what you spent(description,amount,category,date),and it saves everything in your browser.You can search your records with regex,sort them,edit and delete them,and see totals on a dashboard.You can also set a spending cap,switch the displayed amounts to EUR or RWF,and export or import your data as a JSON file


## FEATURES
- About, Dashboard, Add Record form ,Records table and Settings sections
- Add, inline edit and delete records (with confirm on delete)
- Sort by date, description or amount
- Live regex search with a case-insensitive toggle and highlighted matches
- Dashboard: total records, total spent, top category, last 7 days chart
- Spending cap with ARIA live message (polite when under, assertive when over)
- Currency settings: USD base, EUR and RWF with manual rates
- Saves automatically to localStorage
- Import / export JSON (the file is checked before loading)
- Responsive layout (360px, 768px, 1024px)

## Regex catalog
| Where | Pattern | Example |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Bus pass" ok, " Bus pass" fails |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | "12.50" ok, "012" fails |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | "2026-10-12" ok |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Fast-food" ok, "Food2" fails |
| Duplicate word (advanced, back-reference) | `\b(\w+)\s+\1\b` | "the the book" is rejected |
| Rate | `^\d+(\.\d+)?$` | "0.92" ok |

Search examples: `\.\d{2}\b` (cents), `(coffee|tea)`, `\b(\w+)\s+\1\b`

## Keyboard map 
- Tab / Shift+Tab: move between links, inputs and buttons
- Enter: submit a form or press a button
- First Tab on the page: "Skip to content" link
- Arrow keys: change the value in the sort dropdown

## Accessibility notes
- Semantic landmarks: header, nav, main, section, footer
- Every input has a label, focus is visible (orange outline)
- Status messages use role="status", cap messages use aria-live



## Data model 
```json
{
    "id": "txn_0001",
    "description": "Lunch at cafeteria",
    "amount": 12.5,
    "category": "Food",
    "date": "2026-10-12",
    "createdAt": "2026-10-12T09:00:00.000Z",
    "updatedAt": "2026-10-12T09:00:00.000Z"
}
```

## Accessibility plan
- Use semantic landmarks and one h1 with ordered headings
- Every input has a label, and errors are written next to the field
- Visible focus outline and a skip-to-content link
- Status messages use role="status", cap messages use aria-live
- The whole app must work with the keyboard  only


## How to run
Open the folder with Vs Code Live Server and open `index.html`.To run the tests open `tests.html` the same way . Every line should say PASS