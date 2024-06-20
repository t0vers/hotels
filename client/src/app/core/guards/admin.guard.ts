import { Injectable } from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {map, Observable, take} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private _authService: AuthService, private _router: Router) {
        this._authService.initUser();
    }

    canActivate(): Observable<boolean> {
        return this._authService.user.pipe(
            take(1),
            map(user => {
                if (user && user.role_id === 2) {
                    console.log('я тут!')
                    return true;
                } else {
                    this._router.navigate(['/catalog']);
                    console.log('я тут!')
                    return false;
                }
            })
        );
    }
}
