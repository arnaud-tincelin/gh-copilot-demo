import { Router, Request, Response } from 'express';
import { AlbumStore } from '../data/albumStore';
import { NewAlbum } from '../models/album';

export const createAlbumsRouter = (store: AlbumStore): Router => {
  const router = Router();

  // GET /albums - list all albums
  router.get('/', (_req: Request, res: Response) => {
    res.json(store.getAll());
  });

  // GET /albums/:id - get a single album
  router.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album id.' });
    }

    const album = store.getById(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found.' });
    }

    return res.json(album);
  });

  // POST /albums - add a new album
  router.post('/', (req: Request, res: Response) => {
    const validationError = validateNewAlbum(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const created = store.add(req.body as NewAlbum);
    return res.status(201).json(created);
  });

  // PUT /albums/:id - update an existing album
  router.put('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album id.' });
    }

    const updated = store.update(id, req.body as Partial<NewAlbum>);
    if (!updated) {
      return res.status(404).json({ error: 'Album not found.' });
    }

    return res.json(updated);
  });

  // DELETE /albums/:id - delete an album
  router.delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid album id.' });
    }

    const removed = store.delete(id);
    if (!removed) {
      return res.status(404).json({ error: 'Album not found.' });
    }

    return res.status(204).send();
  });

  return router;
};

const validateNewAlbum = (body: unknown): string | null => {
  if (typeof body !== 'object' || body === null) {
    return 'Request body must be a JSON object.';
  }

  const { title, artist, price, image_url, year } = body as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim() === '') {
    return 'title is required and must be a non-empty string.';
  }
  if (typeof artist !== 'string' || artist.trim() === '') {
    return 'artist is required and must be a non-empty string.';
  }
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return 'price is required and must be a number.';
  }
  if (typeof image_url !== 'string' || image_url.trim() === '') {
    return 'image_url is required and must be a non-empty string.';
  }
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    return 'year is required and must be an integer.';
  }

  return null;
};
