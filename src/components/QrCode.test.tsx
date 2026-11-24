import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QrCode } from './QrCode';

describe('QrCode', () => {
  it("génère une image pour le lien d'annonce", () => {
    render(<QrCode value="https://paninibase.app?trade=a3f9bc" size={96} />);
    const img = screen.getByAltText("QR code de mon annonce d'échange") as HTMLImageElement;
    expect(img.src.startsWith('data:image/')).toBe(true);
    expect(img.width).toBe(96);
  });
});
