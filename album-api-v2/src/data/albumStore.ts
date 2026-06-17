import { Album, NewAlbum } from '../models/album';
import { seedAlbums } from '../data/albums';

// In-memory store. Kept in a class so tests can reset state easily.
export class AlbumStore {
  private albums: Album[];

  constructor(initial: Album[] = seedAlbums()) {
    this.albums = initial.map((a) => ({ ...a }));
  }

  getAll(): Album[] {
    return this.albums.map((a) => ({ ...a }));
  }

  getById(id: number): Album | undefined {
    const album = this.albums.find((a) => a.id === id);
    return album ? { ...album } : undefined;
  }

  add(data: NewAlbum): Album {
    const nextId = this.albums.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    const album: Album = { id: nextId, ...data };
    this.albums.push(album);
    return { ...album };
  }

  update(id: number, data: Partial<NewAlbum>): Album | undefined {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return undefined;
    }
    this.albums[index] = { ...this.albums[index], ...data, id };
    return { ...this.albums[index] };
  }

  delete(id: number): boolean {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      return false;
    }
    this.albums.splice(index, 1);
    return true;
  }
}
