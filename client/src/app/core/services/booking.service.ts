import {DestroyRef, inject, Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IBookingRequest} from "../interfaces/requests/booking-request.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../components/snackbar/snackbar.component";
import {IBooking} from "../interfaces/booking.interface";
import {Router} from "@angular/router";

@Injectable()
export class BookingService {
    private _bookedDates$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
    private _userBookings$: BehaviorSubject<IBooking[]> = new BehaviorSubject<IBooking[]>([]);
    private _destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private _http: HttpClient,
        private _snackBar: MatSnackBar,
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


    public get bookedDates(): Observable<Date[]> {
        return this._bookedDates$.asObservable();
    }

    public get userBookings(): Observable<IBooking[]> {
        return this._userBookings$.asObservable();
    }

    public getUserBookings(): void {
        this._http.get<IBooking[]>(`${environment.apiCatalogUrl}/user/bookings`, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (bookings: IBooking[]) => this._userBookings$.next(bookings)
            });
    }

    public getBookedDates(id: number): void {
        this._http.get<string[]>(`${environment.apiCatalogUrl}/available-rooms`, { params: { room_id: id } })
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                map((dates: string[]) => dates.map((date: string) => new Date(date)))
            )
            .subscribe({
                next: (dates: Date[]) => {
                    this._bookedDates$.next(dates);
                }
            })
    }

    public createBooking(booking: IBookingRequest) {
        return this._http.post(`${environment.apiCatalogUrl}/bookings`, booking, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe({
                next: (response: any) => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        data: response.detail ? response.detail : 'Номер успешно забронирован'
                    });
                    this._router.navigate(['/bookings']);
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
}
