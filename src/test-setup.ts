import { useLangStore } from './i18n';

// jsdom annonce une langue anglaise : les tests vérifient l'interface en français.
useLangStore.setState({ lang: 'fr' });
