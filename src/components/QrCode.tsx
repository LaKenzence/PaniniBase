import React, { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/**
 * QR code en image (data URL) : nette à toutes les tailles et capturable
 * par html2canvas pour l'image story.
 */
export const QrCode: React.FC<{ value: string; size: number; style?: React.CSSProperties }> = ({ value, size, style }) => {
  const src = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    return qr.createDataURL(8, 2);
  }, [value]);

  return (
    <img
      src={src}
      alt="QR code de mon annonce d'échange"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', background: '#fff', borderRadius: '10px', display: 'block', ...style }}
    />
  );
};
