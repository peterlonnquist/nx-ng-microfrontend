import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from '@mfe/shared/data-access';
import { ProductList } from './product-list';
import { CATALOG } from './data/catalog';

describe('ProductList', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders the whole catalog', async () => {
    const fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('article').length).toBe(CATALOG.length);
  });

  it('adds a product to the shared cart', async () => {
    const fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('article button')?.click();
    expect(TestBed.inject(CartStore).count()).toBe(1);
  });
});
