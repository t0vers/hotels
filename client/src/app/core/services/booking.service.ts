import {DestroyRef, inject, Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IBookingRequest} from "../interfaces/requests/booking-request.interface";

@Injectable()
export class BookingService {
    private _bookedDates: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
    private _destroyRef: DestroyRef = inject(DestroyRef);

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


    public get bookedDates(): Observable<Date[]> {
        return this._bookedDates.asObservable();
    }

    public getBookedDates(id: number): void {
        this._http.get<string[]>(`${environment.apiCatalogUrl}/available-rooms`, { params: { room_id: id } })
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                map((dates: string[]) => dates.map((date: string) => new Date(date)))
            )
            .subscribe({
                next: (dates: Date[]) => {
                    this._bookedDates.next(dates);
                }
            })
    }

    public createBooking(booking: IBookingRequest) {
        return this._http.post(`${environment.apiCatalogUrl}/bookings`, booking,
            { headers: this.getHeaders() }
        ).subscribe()
    }
}
