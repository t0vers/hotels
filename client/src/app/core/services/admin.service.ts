import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IAdminBooking} from "../interfaces/admin-booking.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export class AdminService {
    private _bookings$: BehaviorSubject<IAdminBooking[]> = new BehaviorSubject<IAdminBooking[]>([]);
    private _destroyRef: DestroyRef = inject(DestroyRef)

    public get bookings(): Observable<IAdminBooking[]> {
        return this._bookings$.asObservable();
    }

    constructor(private _http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const keycloakToken: string = localStorage.getItem(
            'token',
        )!;

        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keycloakToken}`,
        });
    }

    public getBookings(): void {
        this._http.get<IAdminBooking[]>(`${environment.apiAdminUrl}/bookings`, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (bookings: IAdminBooking[]) => this._bookings$.next(bookings)
            });
    }

    public deleteBooking(id: number): void {
        this._http.delete(`${environment.apiAdminUrl}/bookings/${id}`, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => this.getBookings()
            });
    }
}
