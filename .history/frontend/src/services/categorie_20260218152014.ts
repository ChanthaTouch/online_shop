import api from "./api";

function normalizeImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const API_BASE_URL = 'http://127.0.0.1:8000';
  const cleanPath = imagePath.replace(/^(\/|public\/|storage\/)*/i, '');
  return `${API_BASE_URL}/storage/${cleanPath}`;
}

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data.map((cat: any) => ({
      ...cat,
      image_url: normalizeImageUrl(cat.image)
    }));
  }
};