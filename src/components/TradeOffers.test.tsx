import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn(async () => ({ data: null, error: null })) }));
vi.mock('../lib/supabase', () => {
  const query: any = { select: () => query, order: () => query, limit: async () => ({ data: null, error: null }) };
  return { supabase: { from: () => query, rpc } };
});

import { TradeOffers } from './TradeOffers';
import { useOffersStore, useAuthStore, type TradeOffer } from '../store/index';

const offer = (over: Partial<TradeOffer>): TradeOffer => ({
  id: 'o', mine: false, otherName: 'Alice', give: [{ editionId: '18', number: 10 }], receive: [{ editionId: '18', number: 209 }],
  status: 'proposed', iConfirmed: false, otherConfirmed: false, createdAt: '2026-11-03', ...over,
});

describe('onglet Propositions', () => {
  beforeEach(() => {
    rpc.mockClear();
    useAuthStore.setState({ user: null }); // pas de rechargement depuis la base pendant le test
  });

  const show = (offers: TradeOffer[]) => {
    useOffersStore.setState({ offers, loading: false, error: null });
    render(<TradeOffers entryLabel={(e) => `#${e.number}`} />);
  };

  it('proposition reçue : accepter ou refuser', () => {
    show([offer({ id: 'r1' })]);
    expect(screen.getByText('Alice → toi')).toBeTruthy();
    expect(screen.getByText('#10')).toBeTruthy();
    fireEvent.click(screen.getByText('Accepter'));
    expect(rpc).toHaveBeenCalledWith('respond_trade_offer', { offer_id: 'r1', accept: true });
  });

  it('échange accepté : je confirme quand c’est fait', () => {
    show([offer({ id: 'a1', status: 'accepted', mine: true, otherConfirmed: true })]);
    expect(screen.getByText('Alice a déjà confirmé de son côté.')).toBeTruthy();
    expect(screen.getByText("C'est fait, mettre ma collection à jour")).toBeTruthy();
  });

  it('échange terminé : plus aucun bouton', () => {
    show([offer({ status: 'done', iConfirmed: true, otherConfirmed: true })]);
    expect(screen.getByText('Échange terminé')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Accepter|Annuler|C'est fait/ })).toBeNull();
  });
});
