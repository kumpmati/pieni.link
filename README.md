![logo](/static/favicon.png)

# Pieni

> A modern, private, simple URL shortener

## Yet another URL shortener

Pieni.link is a simple sideproject, originally built to test out the development speed with the following stack: [SvelteKit](https://kit.svelte.dev/), [Drizzle ORM](https://orm.drizzle.team/), [Lucia](https://lucia-auth.com/) and [shadcn-svelte](https://www.shadcn-svelte.com/).

The [pieni.link](https://pieni.link) website is hosted on [Netlify](https://app.netlify.com/), and uses [Neon](https://neon.tech/) for the PostgreSQL database.

## Features

- [x] URL shortener (give long URL, get short URL in return)
  - [x] Custom URLs
  - [x] Basic per-link usage tracking
  - [ ] Password-protected links (TODO)
  - [ ] Temporary links (TODO)
- [x] User accounts with roles (admin / member)
  - [x] New users are invite-only (managed by admin users)

## Deployment

There are two ways to deploy Pieni yourself:

### Using Docker

- [ ] A server or service that can run Docker (AWS / DigitalOcean / etc.)
- [ ] Google OAuth credentials

1. Copy the contents of `.env.example` to a file called `.env`, then fill all the environment variables according to the comments in the file.
2. Run `docker compose up --build -d`

### Serverless

You need the following:

- [ ] A service that supports hosting SvelteKit projects (Vercel / Netlify / AWS / etc.)
- [ ] An external PostgreSQL database (example: Neon)
- [ ] Google OAuth credentials

TODO: netlify / vercel guide

## Development

Prerequisites:

- Git
- Node.js (`20` or above)
- PostgreSQL (`15`)

### Setup

Install dependencies

```bash
npm install
```

Copy the contents of `.env.example` to a file called `.env`, then fill all the environment variables according to the comments in the file.

```bash
cp .env.example .env
```

Run the development server

```bash
npm run dev
# navigate to http://localhost:5173
```
