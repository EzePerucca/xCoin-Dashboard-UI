import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGoogleService } from './auth-google.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authGoogleService: AuthGoogleService, private router: Router, private oAuthSvc: OAuthService) {}

  // canActivate(): boolean {
  //   if (this.authGoogleService.isLoggedIn()) {
  //       return true; // Si el usuario está autenticado, permite el acceso
  //   } else {
  //     // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
      console.log('hasValidAccessToken', this.oAuthSvc.hasValidAccessToken())
      return this.oAuthSvc.hasValidAccessToken() ? of(true) : this.handleUnauthenticated();
  }

  private handleUnauthenticated(): Observable<boolean | UrlTree> {
    this.oAuthSvc.revokeTokenAndLogout();
    return of(this.router.createUrlTree(['/login'])); // Redirect to login
  }
  
}