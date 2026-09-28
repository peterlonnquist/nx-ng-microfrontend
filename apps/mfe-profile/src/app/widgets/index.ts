import { WidgetDefinition } from '@mfe/shared/ui';
import { MFE_INFO } from '../mfe-info';

/** Exposed as `mfe-profile/./widgets`. Ids are persisted in layouts – never rename them. */
export const info = MFE_INFO;
export const origin = new URL(import.meta.url).origin;
export const widgets: WidgetDefinition[] = [
  {
    id: 'profile.card',
    title: 'Min profil',
    description: 'Namn, e-post och medlemskap.',
    icon: 'person',
    defaultSize: { cols: 1, rows: 1 },
    load: () => import('./profile-card.widget').then((m) => m.ProfileCardWidget),
  },
];
