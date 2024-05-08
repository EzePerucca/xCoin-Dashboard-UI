import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, filter } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private oauthService: OAuthService, private router: Router) { 
    this.initLogin();

    this.oauthService.tryLogin({
      onTokenReceived: context => {
          //
          // Output just for purpose of demonstration
          // Don't try this at home ... ;-)
          //
          console.debug("logged in");
          console.debug(context);
      }
    });
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '957675670035-8kv07mioq8rvb7e70g009qllqg93ddbk.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',

        // Activate Session Checks:
      // sessionChecksEnabled: true,
    }

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.events.pipe(filter(e => e.type === 'session_terminated')).subscribe(e => {
      console.debug('Your session has been terminated!');
    })
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    // this.oauthService.revokeTokenAndLogout();

  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }
  
  isLoggedIn() {
    const isAuthorized = this.oauthService.hasValidIdToken();
    console.log(isAuthorized)
    return isAuthorized;
  }


}
