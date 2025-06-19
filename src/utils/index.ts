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
