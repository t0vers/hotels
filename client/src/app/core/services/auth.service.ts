import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AuthRequestDto, LoginResponseDto, RegisterRequestDto} from "../../auth/interfaces/dto/auth.dto";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Router} from "@angular/router";
import {IUser} from "../interfaces/user.interface";
import {Observable, Subject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../components/snackbar/snackbar.component";

@Injectable()
export class AuthService {
    private _destroyRef: DestroyRef = inject(DestroyRef);
    private _user$: Subject<IUser> = new Subject<IUser>();

    public get user(): Observable<IUser> {
        return this._user$.asObservable();
    }

    constructor(
        private _http: HttpClient,
        private _router: Router,
        private _snackBar: MatSnackBar
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
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: 'Вы успешно авторизовались!'
                    });
                },
                error: (response: HttpErrorResponse) => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: response.error.detail
                    });
                }
            });
    }

    public register(userData: RegisterRequestDto): void {
        this._http.post(`${environment.apiUsersUrl}/auth/register`, { ...userData, role_id: 1 })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => {
                    this._router.navigate(['/auth/verify']);
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: `Сообщение с токеном отправлено на ${userData.email}`
                    });
                },
                error: (response: HttpErrorResponse) => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: response.error.detail
                    });
                }
            });
    }

    public verify(token: string) {
        this._http.post(`${environment.apiUsersUrl}/auth/verify`, { token: token })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => {
                    this._router.navigate(['/auth/login']);
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: 'Вы успешно верифицировались!'
                    });
                },
                error: (response: HttpErrorResponse) => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: response.error
                    });
                }
            });
    }

    public logout(): void {
        this._http.post(`${environment.apiUsersUrl}/auth/jwt/logout`,{ }, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => {
                    localStorage.removeItem('token');
                    location.reload();
                }
            })
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
        } else {
            this._router.navigate(['catalog']);
        }
    }
}
