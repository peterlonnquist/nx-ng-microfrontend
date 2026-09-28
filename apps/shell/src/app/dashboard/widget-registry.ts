import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WidgetDefinition, WidgetModule } from '@mfe/shared/ui';
import { MfeInfo } from '@mfe/shared/util';
import { NATIVE_FEDERATION } from '../federation/native-federation';

export interface CatalogWidget extends WidgetDefinition {
  remote: string;
  info: MfeInfo;
  origin: string;
}

export interface WidgetCatalog {
  widgets: CatalogWidget[];
  /** Remotes that could not be reached or don't expose `./widgets`. */
  unavailableRemotes: string[];
}

/**
 * Discovers widgets at runtime: every remote in the federation manifest may expose `./widgets`.
 * A team adds a widget by deploying its own remote – the shell needs no change.
 */
@Injectable({ providedIn: 'root' })
export class WidgetRegistry {
  private readonly federation = inject(NATIVE_FEDERATION);
  private readonly http = inject(HttpClient);

  readonly catalog = resource({ loader: () => this.discover() });
  readonly byId = computed(() => new Map((this.catalog.value()?.widgets ?? []).map((w) => [w.id, w])));

  private async discover(): Promise<WidgetCatalog> {
    const manifest = await firstValueFrom(this.http.get<Record<string, string>>('federation.manifest.json'));
    const remotes = Object.keys(manifest);
    const results = await Promise.allSettled(
      remotes.map(async (remote) => {
        const m = await this.federation.loadRemoteModule<WidgetModule>(remote, './widgets');
        return m.widgets.map((w): CatalogWidget => ({ ...w, remote, info: m.info, origin: m.origin }));
      }),
    );

    const widgets = new Map<string, CatalogWidget>();
    const unavailableRemotes: string[] = [];
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.warn(`[widgets] ${remotes[i]} has no widgets or is unavailable`, result.reason);
        unavailableRemotes.push(remotes[i]);
        return;
      }
      for (const w of result.value) {
        if (widgets.has(w.id)) console.warn(`[widgets] duplicate widget id "${w.id}" from ${w.remote} ignored`);
        else widgets.set(w.id, w);
      }
    });
    return { widgets: [...widgets.values()], unavailableRemotes };
  }
}
