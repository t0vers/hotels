import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {AuthService} from "../../services/auth.service";
import {IUser} from "../../interfaces/user.interface";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatMiniFabButton,
        MatIcon,
        RouterLink,
        MatMenuModule,
        AsyncPipe,
        MatButton
    ],
    standalone: true
})
export class HeaderComponent implements OnInit {
    public user$!: Observable<IUser>;


    constructor(
        private _authService: AuthService,
        private _router: Router
    ) { }

    public ngOnInit(): void {
        this.user$ = this._authService.user;
        this._authService.initUser();
    }

    public navigateToBookings(): void {
        this._router.navigate(['/bookings']);
    }

    public logout(): void {
        this._authService.logout();
    }
}
