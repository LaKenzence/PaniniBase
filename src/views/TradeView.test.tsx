import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc,
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
        // propositions d'échange : aucune
        order: () => ({ limit: async () => ({ data: [], error: null }) }),
      }),
    }),
  },
}));

import { TradeView } from './TradeView';
import { useAuthStore, useTradesStore } from '../store/index';

describe('TradeView', () => {
  beforeEach(() => {
    rpc.mockReset();
    useAuthStore.setState({ user: { id: 'u1' } as any });
    useTradesStore.setState({ matches: [], matchesLoading: false, myTrade: null });
  });

  it("demande de se connecter quand personne n'est connecté", () => {
    useAuthStore.setState({ user: null });
    render(<TradeView />);
    expect(screen.getByText('Mode Échange')).toBeTruthy();
  });

  it('affiche l’onglet Matches sans planter', () => {
    render(<TradeView />);
    fireEvent.click(screen.getByText('Matches'));
    expect(screen.getByText('Trouver mes matches')).toBeTruthy();
  });

  it('le bouton « Voir » envoie le code saisi (et pas le clic)', async () => {
    rpc.mockResolvedValue({ data: [{ have_stickers: [], want_stickers: [], username: 'lea' }], error: null });
    render(<TradeView />);
    fireEvent.click(screen.getByText('Trouver un échange'));
    fireEvent.change(screen.getByPlaceholderText('Code (ex : a3f9bc)'), { target: { value: '  a3f9bc ' } });
    fireEvent.click(screen.getByText('Voir →'));
    expect(rpc).toHaveBeenCalledWith('get_trade_by_token', { token: 'a3f9bc' });
    await waitFor(() => expect(screen.getByText('lea')).toBeTruthy());
  });
});
