import { bootstrapApplication } from '@angular/platform-browser';
import type { NativeFederationResult } from '@angular-architects/native-federation';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { NATIVE_FEDERATION } from './app/federation/native-federation';

export function bootstrap(federation: NativeFederationResult) {
  return bootstrapApplication(App, {
    ...appConfig,
    providers: [...appConfig.providers, { provide: NATIVE_FEDERATION, useValue: federation }],
  });
}
