import ApiService from './api.service';
import { configs } from '../configs';

class CloudinaryService {
  private cloudName = configs.CLOUDINARY_CLOUD_NAME;
  private uploadPreset = configs.CLOUDINARY_CLOUD_UPLOAD_PRESET;

  async uploadImage(image: File): Promise<{ url?: string; error?: string }> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', this.uploadPreset);

    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: data,
      });

      if (!response.ok) {
        console.log(response);
        const error = await response.text();
        return { error };
      }

      const json = await response.json();

      return { url: json.secure_url };
    } catch (error) {
      const typeError = error as TypeError;
      return { error: typeError.message };
    }
  }
}

export default CloudinaryService;
