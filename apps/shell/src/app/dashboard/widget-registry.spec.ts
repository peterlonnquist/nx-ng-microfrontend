import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NATIVE_FEDERATION } from '../federation/native-federation';
import { WidgetRegistry } from './widget-registry';

@Component({ template: '' })
class FakeWidget {}

const info = { name: 'mfe-cart', team: 'Team Checkout', version: '1.0.0' };

describe('WidgetRegistry', () => {
  it('collects widgets from reachable remotes and reports the rest', async () => {
    const loadRemoteModule = vi.fn(async (remote: string) => {
      if (remote === 'mfe-down') throw new Error('offline');
      return {
        info,
        origin: 'http://localhost:4203',
        widgets: [{ id: 'cart.summary', title: 'Varukorg', description: '', icon: 'x', defaultSize: { cols: 1, rows: 1 }, load: async () => FakeWidget }],
      };
    });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NATIVE_FEDERATION, useValue: { loadRemoteModule } },
      ],
    });

    const registry = TestBed.inject(WidgetRegistry);
    TestBed.tick();
    TestBed.inject(HttpTestingController)
      .expectOne('federation.manifest.json')
      .flush({ 'mfe-cart': 'http://localhost:4203/remoteEntry.json', 'mfe-down': 'http://localhost:9/remoteEntry.json' });
    await vi.waitFor(() => expect(registry.catalog.hasValue()).toBe(true));

    expect(registry.byId().get('cart.summary')?.remote).toBe('mfe-cart');
    expect(registry.catalog.value()?.unavailableRemotes).toEqual(['mfe-down']);
  });
});
