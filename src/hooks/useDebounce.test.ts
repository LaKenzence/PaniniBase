import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retourne la valeur initiale immédiatement', () => {
    const { result } = renderHook(() => useDebounce('a', 200));
    expect(result.current).toBe('a');
  });

  it('ne met pas à jour la valeur avant la fin du délai', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(100); }); // seulement la moitié du délai

    expect(result.current).toBe('a');
  });

  it('met à jour la valeur une fois le délai écoulé', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current).toBe('b');
  });

  it('redémarre le délai à chaque changement rapide (frappe au clavier)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => { vi.advanceTimersByTime(150); });
    rerender({ value: 'abc' }); // nouvelle frappe avant la fin du délai précédent
    act(() => { vi.advanceTimersByTime(150); });

    // Le délai a été repoussé par la 2e frappe : toujours pas mis à jour
    expect(result.current).toBe('a');

    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('abc');
  });
});
