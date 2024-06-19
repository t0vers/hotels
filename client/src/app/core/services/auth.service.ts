import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthRequestDto, LoginResponseDto} from "../../auth/interfaces/dto/auth.dto";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {IUser} from "../interfaces/user.interface";
import {Observable, Subject} from "rxjs";

@Injectable()
export class AuthService {
    private _destroyRef: DestroyRef = inject(DestroyRef);
    private _user$: Subject<IUser> = new Subject<IUser>();

    public get user(): Observable<IUser> {
        return this._user$.asObservable();
    }

    constructor(
        private _http: HttpClient,
        private _router: Router
    ) { }

    private getHeaders(): HttpHeaders {
        const keycloakToken: string = localStorage.getItem(
            'token',
        )!;

        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
        });
    }

    public login(userData: AuthRequestDto): void {
        const userFormData: FormData = new FormData();
        userFormData.append('username', userData.username);
        userFormData.append('password', userData.password);

        this._http.post<LoginResponseDto>(`${environment.apiUsersUrl}/auth/jwt/login`, userFormData)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (response: LoginResponseDto) => {
                    localStorage.setItem('token', response.access_token);
                    this._router.navigate(['catalog']);
                }
            });
    }

    public initUser(): void {
        if (localStorage.getItem('token')) {
            this._http.get<IUser>(`${environment.apiUsersUrl}/protected-route`, { headers: this.getHeaders() })
                .pipe(
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe({
                    next: (user: IUser) => this._user$.next(user)
                });
        }
    }
}
