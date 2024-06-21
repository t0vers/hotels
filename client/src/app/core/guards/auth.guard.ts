import {Injectable, OnInit} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {map, Observable, take} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private _authService: AuthService, private _router: Router) {
        // console.log('инициалаз')
    }

    canActivate(): Observable<boolean> {
        this._authService.initUser();
        return this._authService.user.pipe(
            take(1),
            map(user => {
                if (user) {
                    return true;
                } else {
                    this._router.navigate(['/catalog']);
                    return false;
                }
            })
        );
    }
}

