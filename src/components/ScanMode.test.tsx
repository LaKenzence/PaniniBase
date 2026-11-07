import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ScanMode } from './ScanMode';
import { useCollectionStore } from '../store/index';
import { STICKERS_BY_EDITION } from '../data/stickers';

// L'album 2026 est complet sans rien charger : idéal pour tester le scan.
const first = STICKERS_BY_EDITION['26'].slice(0, 3).map((s) => s.number);

describe('ScanMode', () => {
  beforeEach(() => {
    useCollectionStore.setState({ collection: {}, history: [], future: [], pendingSync: {} });
    vi.useFakeTimers();
  });

  const iHaveIt = () => {
    fireEvent.click(screen.getByLabelText('Marquer comme possédé'));
    act(() => { vi.advanceTimersByTime(300); }); // fin de l'animation de la carte
  };

  it('coche les stickers dans l\'ordre sans en sauter', () => {
    render(<ScanMode editionId="26" onClose={() => {}} />);
    iHaveIt();
    iHaveIt();
    const { isOwned } = useCollectionStore.getState();
    expect(isOwned('26', first[0])).toBe(true);
    expect(isOwned('26', first[1])).toBe(true);
    expect(isOwned('26', first[2])).toBe(false);
  });

  it('« Annuler » revient au sticker précédent et le décoche', () => {
    render(<ScanMode editionId="26" onClose={() => {}} />);
    iHaveIt();
    fireEvent.click(screen.getByLabelText('Revenir au sticker précédent'));
    expect(useCollectionStore.getState().isOwned('26', first[0])).toBe(false);
    expect(screen.getByText(`#${first[0]}`)).toBeTruthy();
  });
});
