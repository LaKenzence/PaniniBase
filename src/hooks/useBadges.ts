import { useMemo } from 'react';
import { Sparkles, BookOpen, Trophy, Star, ArrowLeftRight, Globe2, Crown } from 'lucide-react';
import { EDITIONS, STICKERS_BY_EDITION } from '../data/stickers';
import { useCollectionStore, useTradesStore } from '../store/index';
import { useDataVersion } from './useEditionData';
import { useT } from '../i18n';

export interface Badge {
  id: string;
  Icon: typeof Sparkles;
  title: string;
  description: string;
  earned: boolean;
  progress?: string; // ex: "3 / 5"
}

/**
 * Calcule les badges débloqués à partir de la collection actuelle.
 * Tout est dérivé localement, aucune donnée supplémentaire en base.
 */
export function useBadges(): Badge[] {
  const collection = useCollectionStore((s) => s.collection);
  const myTrade = useTradesStore((s) => s.myTrade);
  const version = useDataVersion();
  const t = useT();

  return useMemo(() => {
    const entries = Object.values(collection).filter((e) => e.owned);
    const ownedCount = entries.length;
    const dupeCount = entries.reduce((sum, e) => sum + e.duplicates, 0);

    const editionsWithOwned = new Set(entries.map((e) => e.stickerEditionId)).size;

    let shinyOwned = 0;
    let albumsCompleted = 0;
    EDITIONS.forEach((ed) => {
      const stickers = STICKERS_BY_EDITION[ed.id] ?? [];
      const ownedInEdition = stickers.filter((s) => collection[`${ed.id}-${s.number}`]?.owned);
      shinyOwned += ownedInEdition.filter((s) => s.isShiny).length;
      if (stickers.length > 0 && ownedInEdition.length === ed.totalStickers) albumsCompleted++;
    });

    const hasTradeAd = !!myTrade && (myTrade.have.length > 0 || myTrade.want.length > 0);

    return [
      {
        id: 'first-sticker',
        Icon: Sparkles,
        title: t('Premier sticker'),
        description: t('Ajoute ton premier sticker à la collection'),
        earned: ownedCount >= 1,
      },
      {
        id: 'collector-50',
        Icon: BookOpen,
        title: t('Collectionneur'),
        description: t('Possède {n} stickers', { n: 50 }),
        earned: ownedCount >= 50,
        progress: ownedCount < 50 ? `${ownedCount} / 50` : undefined,
      },
      {
        id: 'album-complete',
        Icon: Trophy,
        title: t('Album complet'),
        description: t('Termine un album à 100%'),
        earned: albumsCompleted >= 1,
      },
      {
        id: 'shiny-hunter',
        Icon: Star,
        title: t('Chasseur de shiny'),
        description: t('Possède 5 stickers brillants'),
        earned: shinyOwned >= 5,
        progress: shinyOwned < 5 ? `${shinyOwned} / 5` : undefined,
      },
      {
        id: 'trader',
        Icon: ArrowLeftRight,
        title: t('Échangeur'),
        description: t("Crée une annonce d'échange ou accumule 10 doublons"),
        earned: hasTradeAd || dupeCount >= 10,
        progress: !hasTradeAd && dupeCount < 10 ? t('{n} / 10 doublons', { n: dupeCount }) : undefined,
      },
      {
        id: 'explorer',
        Icon: Globe2,
        title: t('Explorateur'),
        description: t('Possède au moins un sticker dans 5 albums différents'),
        earned: editionsWithOwned >= 5,
        progress: editionsWithOwned < 5 ? t('{n} / 5 albums', { n: editionsWithOwned }) : undefined,
      },
      {
        id: 'master',
        Icon: Crown,
        title: t('Maître Panini'),
        description: t('Possède {n} stickers', { n: 500 }),
        earned: ownedCount >= 500,
        progress: ownedCount < 500 ? `${ownedCount} / 500` : undefined,
      },
    ];
  }, [collection, myTrade, version, t]);
}
