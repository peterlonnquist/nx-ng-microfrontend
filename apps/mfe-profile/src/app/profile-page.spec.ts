import { TestBed } from '@angular/core/testing';
import { UserStore } from '@mfe/shared/data-access';
import { ProfilePage } from './profile-page';

describe('ProfilePage', () => {
  beforeEach(() => localStorage.clear());

  it('saves changes to the shared user store', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('input[formControlName="name"]');
    if (!input) throw new Error('name input missing');
    input.value = 'Kim Berg';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    el.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    expect(TestBed.inject(UserStore).user().name).toBe('Kim Berg');
  });
});
