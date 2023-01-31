# Miami University Explorer

## Stack

-   JavaScript runtime with [Node](https://nodejs.org/en/)
-   Web framework with [Remix](https://remix.run/)
-   Static Types with [TypeScript](https://typescriptlang.org/)
-   Database with [SQLite](https://sqlite.org/index.html) and [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
-   CSS framework with [Tailwind](https://tailwindcss.com/)
-   Headless UI components with [Headless UI](https://headlessui.com/)
-   Code formatting with [Prettier](https://prettier.io/)
-   App deployment with [Fly.io](https://fly.io/)

## Decisions

Storing selected fields in local storage instead of URL:

-   Better caching
-   No revalidation required

Buildings navigation:

-   Reuse Miami Buildings API in-memory cache
-   Client side navigation with no revalidation required

Models:

-   Courses
-   Semesters?
-   Instructors?

Potential performance:

-   Proxy through NGINX server

## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
