import { Injectable } from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {map, Observable, take} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(): Observable<boolean> {
        return this._authService.user.pipe(
            take(1),
            map(user => {
                console.log('User in AuthGuard:', user);
                if (user && user.role_id === 2) {
                    return true;
                } else {
                    this._router.navigate(['/catalog']);
                    return false;
                }
            })
        );
    }
}
