import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export class UnsplashService {
  constructor() {
    this.accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  }

  async searchPhotos(query, count = 1) {
    try {
      console.log('Using access key:', this.accessKey);
      const response = await axios.get(UNSPLASH_API_URL, {
        params: {
          query,
          per_page: count,
          orientation: 'landscape',
          client_id: this.accessKey
        }
      });

      return response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        alt: photo.alt_description,
        credit: {
          name: photo.user.name,
          link: photo.user.links.html
        }
      }));
    } catch (error) {
      console.error('Error fetching stock photos:', error.response || error);
      throw error;
    }
  }
}

export const unsplashService = new UnsplashService();