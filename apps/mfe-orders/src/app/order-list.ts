import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderStore } from '@mfe/shared/data-access';
import { EmptyState, PageHeader } from '@mfe/shared/ui';
import { formatDate, formatPrice, Order } from '@mfe/shared/util';
import { ORDER_STATUS } from './order-status';


@Component({
  selector: 'ord-order-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule, EmptyState, PageHeader],
  template: `
    <mfe-page-header heading="Ordrar" [subheading]="store.count() + ' ordrar totalt'" />

    @if (store.orders().length) {
      <div class="overflow-x-auto rounded-2xl bg-surface-container">
        <table mat-table [dataSource]="store.orders()" class="!bg-transparent">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>Order</th>
            <td mat-cell *matCellDef="let o" class="font-medium">{{ o.id }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Datum</th>
            <td mat-cell *matCellDef="let o">{{ date(o.createdAt) }}</td>
          </ng-container>
          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef>Artiklar</th>
            <td mat-cell *matCellDef="let o">{{ summary(o) }}</td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef class="!text-right">Summa</th>
            <td mat-cell *matCellDef="let o" class="!text-right tabular-nums">{{ price(o.total) }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let o">
              <span class="rounded-full px-3 py-1 text-xs font-medium" [class]="statusOf(o).classes">
                {{ statusOf(o).label }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let o" class="!text-right">
              <button
                mat-icon-button
                matTooltip="Flytta till nästa steg"
                [disabled]="o.status === 'delivered'"
                (click)="store.advance(o.id)"
              >
                <mat-icon>local_shipping</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      </div>
    } @else {
      <mfe-empty-state heading="Inga ordrar" icon="receipt_long">Lägg din första order via varukorgen.</mfe-empty-state>
    }
  `,
})
export class OrderList {
  protected readonly store = inject(OrderStore);
  protected readonly columns = ['id', 'date', 'items', 'total', 'status', 'actions'];
  protected readonly price = formatPrice;
  protected readonly date = formatDate;

  protected statusOf(order: Order) {
    return ORDER_STATUS[order.status];
  }

  protected summary(order: Order): string {
    return order.items.map((i) => `${i.product.emoji} ${i.quantity}× ${i.product.name}`).join(', ');
  }
}
