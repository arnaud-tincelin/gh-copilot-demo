import request from 'supertest';
import { createApp } from '../app';
import { AlbumStore } from '../data/albumStore';

describe('albums API', () => {
  const buildApp = () => createApp(new AlbumStore());

  describe('GET /albums', () => {
    it('returns all seeded albums', async () => {
      const res = await request(buildApp()).get('/albums');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(6);
      expect(res.body[0]).toEqual({
        id: 1,
        title: 'You, Me and an App Id',
        artist: 'Daprize',
        price: 10.99,
        image_url: 'https://aka.ms/albums-daprlogo',
        year: 2020
      });
    });
  });

  describe('GET /albums/:id', () => {
    it('returns a single album when it exists', async () => {
      const res = await request(buildApp()).get('/albums/3');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Scale It Up');
    });

    it('returns 404 when the album does not exist', async () => {
      const res = await request(buildApp()).get('/albums/999');

      expect(res.status).toBe(404);
    });

    it('returns 400 for a non-numeric id', async () => {
      const res = await request(buildApp()).get('/albums/abc');

      expect(res.status).toBe(400);
    });
  });

  describe('POST /albums', () => {
    it('adds a new album and assigns the next id', async () => {
      const app = buildApp();
      const newAlbum = {
        title: 'Test Driven Beats',
        artist: 'The Mockingbirds',
        price: 9.99,
        image_url: 'https://example.com/tdd.png',
        year: 2023
      };

      const res = await request(app).post('/albums').send(newAlbum);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 7, ...newAlbum });

      const list = await request(app).get('/albums');
      expect(list.body).toHaveLength(7);
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(buildApp()).post('/albums').send({ title: 'Incomplete' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('PUT /albums/:id', () => {
    it('updates an existing album', async () => {
      const res = await request(buildApp())
        .put('/albums/1')
        .send({ price: 19.99 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(19.99);
      expect(res.body.id).toBe(1);
      expect(res.body.title).toBe('You, Me and an App Id');
    });

    it('returns 404 when updating a missing album', async () => {
      const res = await request(buildApp()).put('/albums/999').send({ price: 1 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /albums/:id', () => {
    it('deletes an existing album', async () => {
      const app = buildApp();

      const res = await request(app).delete('/albums/2');
      expect(res.status).toBe(204);

      const list = await request(app).get('/albums');
      expect(list.body).toHaveLength(5);
      expect(list.body.find((a: { id: number }) => a.id === 2)).toBeUndefined();
    });

    it('returns 404 when deleting a missing album', async () => {
      const res = await request(buildApp()).delete('/albums/999');

      expect(res.status).toBe(404);
    });
  });
});
