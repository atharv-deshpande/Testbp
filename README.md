# PPF Maturity Calculator

A responsive, browser-based Public Provident Fund (PPF) projection calculator. No build step, framework, backend, API key, or external JavaScript dependency is required.

## Run locally

Open `index.html` in a modern browser, or serve this directory with any static web server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Features

- Yearly, monthly, and one-time deposit modes.
- Editable annual interest rate and a 15-year projection.
- PPF annual deposit validation (₹500 minimum and ₹1,50,000 maximum).
- Monthly interest estimation using the PPF lowest-balance convention: eligible balance from the 5th through month-end.
- Beginning/after-the-5th deposit timing for recurring contributions.
- Maturity estimate, total principal, estimated interest, year-wise schedule, and growth chart.
- Responsive layout and accessible labels/error messaging.

## Calculation assumptions

- The projection spans 15 financial years.
- Yearly and one-time deposits are assumed to be made in April. Monthly deposits are made once each month.
- For recurring deposits, the timing selector determines whether a deposit earns interest in its deposit month (on/before the 5th) or from the following month (after the 5th).
- Interest is estimated monthly and added to the balance at the end of each financial year, reflecting annual crediting.
- The entered interest rate is held constant for all 15 years. Actual Government-notified PPF rates may change each quarter; change the rate input to explore a different assumption.
- A one-time deposit is assumed to be made in April of year one.
- The calculator is an educational estimate, not an official PPF account statement. Actual maturity value depends on deposit dates, account opening date, applicable rules, and notified rates.

## PPF limits and rate reference

The app uses the commonly applicable annual contribution limits of ₹500 minimum and ₹1,50,000 maximum. Check current rules and rates with your bank, India Post, or the Department of Economic Affairs:

- [Department of Economic Affairs – Small Savings](https://dea.gov.in/budget-division/475)
- [India Post – National Savings Schemes](https://www.indiapost.gov.in/Financial/Pages/Content/National-Savings-Schemes.aspx)

## Project files

- `index.html` – page structure and calculator inputs/results.
- `styles.css` – responsive visual styling.
- `app.js` – validation, projection logic, chart, and year-wise schedule.
