import { showImagePreview } from 'vant';

 export const handleClickImagePreview = () => {
  showImagePreview({
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
    ],
    closeable: true,
  });
}