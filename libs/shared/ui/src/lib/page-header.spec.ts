import { inputBinding } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('renders heading', async () => {
    const fixture = TestBed.createComponent(PageHeader, {
      bindings: [inputBinding('heading', () => 'Hello')],
    });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Hello');
  });
});
