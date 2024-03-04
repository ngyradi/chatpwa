import { type ApplicationConfig, isDevMode } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { provideServiceWorker } from '@angular/service-worker'
import { GoogleLoginProvider, SocialAuthService, type SocialAuthServiceConfig } from '@abacritt/angularx-social-login'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  }),
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '577854880247-c87e3133hpphvjphd1ul3gbggk7cjo60.apps.googleusercontent.com'
          )
        }
      ],
      onError: (err) => {
        console.error(err)
      }
    } satisfies SocialAuthServiceConfig
  },
  SocialAuthService
  ]
}
