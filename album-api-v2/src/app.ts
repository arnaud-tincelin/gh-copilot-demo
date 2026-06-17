import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { AlbumStore } from './data/albumStore';
import { createAlbumsRouter } from './routes/albums';

export const createApp = (store: AlbumStore = new AlbumStore()): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hit the /albums endpoint to retrieve a list of albums!');
  });

  app.use('/albums', createAlbumsRouter(store));

  return app;
};
