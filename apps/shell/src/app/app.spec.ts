import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from '@mfe/shared/data-access';
import { App } from './app';
import { NAV_ITEMS } from './layout/navigation';

describe('Shell App', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders the navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('mat-nav-list a');
    expect(links.length).toBe(NAV_ITEMS.length);
  });

  it('shows the shared cart count in the toolbar badge', async () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(CartStore).add({ id: 'x', name: 'X', description: '', category: 'c', price: 1, emoji: '📦', rating: 5 }, 3);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.mat-badge-content')?.textContent).toContain('3');
  });
});
