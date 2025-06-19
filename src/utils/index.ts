import { ImgurImage } from '@/app/config/page';
import QRCode from 'qrcode';

export async function generateQrCodeUrl(url: string) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H', // Nível de correção de erro (L, M, Q, H)
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    return null;
  }
}

export const calculateDailyImages = (images: ImgurImage[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  return images.filter(image => {
    const imageDate = new Date(image.datetime);
    imageDate.setHours(0, 0, 0, 0);
    return imageDate.getTime() >= today.getTime() && imageDate.getTime() <= endOfToday.getTime();
  })?.length || 0;
}