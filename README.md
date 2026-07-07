# Order Management Frontend

React + Vite frontend for the Order Management System.

## Prerequisites

- Node.js 20 or newer
- npm
- Order Management backend running locally or available on a hosted URL

## Clone The Project

```bash
git clone https://github.com/nalin70/order-management-frontend.git
cd order-management-frontend
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file in the project root.

For a local backend:

```env
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
```

For a hosted backend:

```env
VITE_API_PROXY_TARGET=http://your-backend-host
```

The frontend calls `/api/...`; Vite proxies those requests to `VITE_API_PROXY_TARGET` during local development.

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Build

```bash
npm run build
```

The production build is created in `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```
