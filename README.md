# Data Selling

A web application that simulates a data monetization platform. Users share their bandwidth/data and earn rupee balance in return, which they can withdraw via UPI.

## Features

- **Home** — Start or stop selling data, view real-time balance and total data sold, transaction history
- **Wallet** — View current balance, total data sold, and withdrawal history
- **Withdraw** — Submit UPI withdrawal requests (minimum ₹50)

## Tech Stack

- **Framework**: TanStack Start (React 19, TanStack Router)
- **Build**: Vite 7
- **Styling**: Tailwind CSS 4
- **Database**: Netlify Database (Postgres) with Drizzle ORM
- **Backend**: Netlify Functions
- **Deployment**: Netlify

## Running Locally

```bash
npm install
netlify dev
```

The app will be available at `http://localhost:8888`.

## Environment

No extra environment variables are required. The Netlify Database connection is provisioned automatically when deployed to Netlify.
