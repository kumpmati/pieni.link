![logo](/static/favicon.png)

# Pieni

> A modern, private, simple URL shortener

## Yet another URL shortener

Pieni.link is a simple sideproject, originally built to test out the development speed with the following stack: [SvelteKit](https://kit.svelte.dev/), [Drizzle ORM](https://orm.drizzle.team/), [Lucia](https://lucia-auth.com/) and [shadcn-svelte](https://www.shadcn-svelte.com/).

The website itself is hosted on [Netlify](https://app.netlify.com/), and uses [Neon](https://neon.tech/) to host the PostgreSQL database.

## Features

- [x] URL shortener (give long URL, get short URL in return)
  - [x] Custom URLs
  - [x] Per-link usage tracking
  - [ ] Password-protected links (TODO)
- [x] User accounts with roles (admin / member)
  - [x] New users are invite-only (managed by admin users)

## Self-hosting

To self-host Pieni, there are two paths:

### Serverless

You need the following:

- [ ] A service that supports hosting SvelteKit projects (Vercel / Netlify / AWS / etc.)
- [ ] A PostgreSQL database (Neon recommended)
- [ ] Google OAuth credentials

### Using Docker

- [ ] A server or service that can run Docker (AWS / DigitalOcean / etc.)
- [ ] Google OAuth credentials

TODO: Guides for hosting + Docker setup

## Development

Prerequisites:

- Git
- Node.js (`v18.x` or above)
- PostgreSQL (`15`)

### Setup

Install dependencies

```bash
npm install
```

Copy the contents of `.env.example` to a file called `.env`, then fill all the environment variables

```bash
cp .env.example .env
```

Run the development server

```bash
npm run dev
```
