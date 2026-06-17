# album-api-v2

A Node.js + TypeScript rewrite of the original DotNet `albums-api`. It manages a collection of music albums in memory (no database required) and exposes a REST API that is compatible with the existing VueJS `album-viewer` app.

## Features

- Written in TypeScript with Express
- In-memory data store seeded with the same sample data as the original `albums-api`
- Full CRUD routes: list, get, add, update, delete
- CORS enabled
- Unit tests with Jest + supertest
- Listens on port `3000` to match the VueJS app's Vite proxy

## Prerequisites

- Node.js (LTS) and npm

## Setup

```bash
cd album-api-v2
npm install
```

## Build

Compiles TypeScript from `src/` into `dist/`:

```bash
npm run build
```

## Run

Start the compiled server (listens on port `3000`):

```bash
npm run build
npm start
```

Or run directly in development without a separate build step:

```bash
npm run dev
```

The port can be overridden with the `PORT` environment variable:

```bash
PORT=4000 npm start
```

## Test

Run the unit tests:

```bash
npm test
```

## API routes

Base URL: `http://localhost:3000`

| Method | Route          | Description                  | Success | Errors            |
| ------ | -------------- | ---------------------------- | ------- | ----------------- |
| GET    | `/albums`      | List all albums              | 200     | —                 |
| GET    | `/albums/:id`  | Get a single album by id     | 200     | 400, 404          |
| POST   | `/albums`      | Add a new album              | 201     | 400               |
| PUT    | `/albums/:id`  | Update an existing album     | 200     | 400, 404          |
| DELETE | `/albums/:id`  | Delete an album              | 204     | 400, 404          |

### Album shape

```json
{
  "id": 1,
  "title": "You, Me and an App Id",
  "artist": "Daprize",
  "price": 10.99,
  "image_url": "https://aka.ms/albums-daprlogo",
  "year": 2020
}
```

When creating (`POST`) or updating (`PUT`), send the album fields without `id` in the JSON body. For `POST`, all of `title`, `artist`, `price`, `image_url`, and `year` are required.

### Examples

```bash
# List all albums
curl http://localhost:3000/albums

# Get a single album
curl http://localhost:3000/albums/2

# Add a new album
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{"title":"New Album","artist":"New Artist","price":9.99,"image_url":"https://example.com/cover.png","year":2023}'

# Update an album
curl -X PUT http://localhost:3000/albums/1 \
  -H "Content-Type: application/json" \
  -d '{"price":19.99}'

# Delete an album
curl -X DELETE http://localhost:3000/albums/2
```

## Use with the VueJS app

The `album-viewer` Vite dev server proxies `/albums` to `http://localhost:3000`, so simply start this API on port `3000` and run the Vue app — no frontend changes required.

## Project structure

```
album-api-v2/
├── src/
│   ├── app.ts                 # Express app setup (CORS, JSON, routes)
│   ├── server.ts              # Entry point, listens on port 3000
│   ├── models/
│   │   └── album.ts           # Album and NewAlbum types
│   ├── data/
│   │   ├── albums.ts          # Seed sample data
│   │   └── albumStore.ts      # In-memory CRUD store
│   ├── routes/
│   │   └── albums.ts          # /albums route handlers
│   └── __tests__/
│       └── albums.test.ts     # Unit tests
├── jest.config.js
├── package.json
└── tsconfig.json
```
