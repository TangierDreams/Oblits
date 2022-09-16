import { AuthenticationService } from './auth-firebase.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {

    }

    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (!this.authenticationService.isLoggedIn) {
            console.log("No se puede pasar...");
            this.router.navigateByUrl("/auth");
        }
        return this.authenticationService.isLoggedIn;
    }


}
