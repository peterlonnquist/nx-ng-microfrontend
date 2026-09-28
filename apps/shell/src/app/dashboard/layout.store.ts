import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardLayout, WidgetPlacement } from '@mfe/shared/util';

/** Same-origin URL: proxied to layout-api by the dev server (proxy.conf.json) and by nginx in Docker. */
const LAYOUT_URL = '/api/layout';

@Injectable({ providedIn: 'root' })
export class DashboardLayoutStore {
  private readonly http = inject(HttpClient);

  readonly layout = httpResource<DashboardLayout>(() => LAYOUT_URL);

  async save(widgets: WidgetPlacement[]): Promise<void> {
    this.layout.set(await firstValueFrom(this.http.put<DashboardLayout>(LAYOUT_URL, { widgets })));
  }

  async resetToDefault(): Promise<void> {
    this.layout.set(await firstValueFrom(this.http.delete<DashboardLayout>(LAYOUT_URL)));
  }
}
