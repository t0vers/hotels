import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthRequestDto, LoginResponseDto} from "../interfaces/dto/auth.dto";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class AuthService {
    private _destroyRef: DestroyRef = inject(DestroyRef);

    constructor(private _http: HttpClient) { }

    public login(userData: AuthRequestDto): void {
        const userFormData: FormData = new FormData();
        userFormData.append('username', userData.username);
        userFormData.append('password', userData.password);

        this._http.post<LoginResponseDto>(`${environment.apiUrl}/auth/jwt/login`, userFormData)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (response: LoginResponseDto) => {
                    localStorage.setItem('token', response.access_token);
                }
            });
    }
}
