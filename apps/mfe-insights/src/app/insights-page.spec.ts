import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InsightsPage } from './insights-page';

describe('InsightsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('shows key figures and recent orders', async () => {
    const fixture = TestBed.createComponent(InsightsPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Insikter');
    expect(el.textContent).toContain('ORD-1002');
  });
});
