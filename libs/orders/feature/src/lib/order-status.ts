import { OrderStatus } from '@mfe/shared/util';

export const ORDER_STATUS: Record<OrderStatus, { label: string; classes: string }> = {
  placed: { label: 'Mottagen', classes: 'bg-secondary-container text-on-secondary-container' },
  packed: { label: 'Packad', classes: 'bg-tertiary-container text-on-tertiary-container' },
  shipped: { label: 'Skickad', classes: 'bg-primary-container text-on-primary-container' },
  delivered: { label: 'Levererad', classes: 'bg-surface-container-highest text-on-surface' },
};
