import { Album } from '../models/album';

// Sample data ported 1:1 from the original DotNet albums-api (Album.GetAll()).
export const seedAlbums = (): Album[] => [
  { id: 1, title: 'You, Me and an App Id', artist: 'Daprize', price: 10.99, image_url: 'https://aka.ms/albums-daprlogo', year: 2020 },
  { id: 2, title: 'Seven Revision Army', artist: 'The Blue-Green Stripes', price: 13.99, image_url: 'https://aka.ms/albums-containerappslogo', year: 2021 },
  { id: 3, title: 'Scale It Up', artist: 'KEDA Club', price: 13.99, image_url: 'https://aka.ms/albums-kedalogo', year: 2022 },
  { id: 4, title: 'Lost in Translation', artist: 'MegaDNS', price: 12.99, image_url: 'https://aka.ms/albums-envoylogo', year: 2019 },
  { id: 5, title: 'Lock Down Your Love', artist: 'V is for VNET', price: 12.99, image_url: 'https://aka.ms/albums-vnetlogo', year: 2020 },
  { id: 6, title: "Sweet Container O' Mine", artist: 'Guns N Probeses', price: 14.99, image_url: 'https://aka.ms/albums-containerappslogo', year: 2021 }
];
