import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IAdminBooking} from "../interfaces/admin-booking.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ICategory} from "../interfaces/category.interface";

@Injectable()
export class AdminService {
    private _bookings$: BehaviorSubject<IAdminBooking[]> = new BehaviorSubject<IAdminBooking[]>([]);
    private _categories$: BehaviorSubject<ICategory[]> = new BehaviorSubject<ICategory[]>([]);
    private _destroyRef: DestroyRef = inject(DestroyRef)

    public get bookings(): Observable<IAdminBooking[]> {
        return this._bookings$.asObservable();
    }

    public get categories(): Observable<ICategory[]> {
        return this._categories$.asObservable();
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

    public getCategories(): void {
        this._http.get<ICategory[]>(`${environment.apiAdminUrl}/categories`, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (categories: ICategory[]) => this._categories$.next(categories)
            });
    }

    public createCategory(category: ICategory): void {
        this._http.post(`${environment.apiAdminUrl}/categories`, category, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => this.getCategories()
            });
    }

    public editCategory(category: ICategory): void {
        this._http.put(`${environment.apiAdminUrl}/categories/${category.id}`, {
            value: category.value
        }, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => this.getCategories()
            });
    }

    public deleteCategory(id: number): void {
        this._http.delete(`${environment.apiAdminUrl}/categories/${id}`, { headers: this.getHeaders() })
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: () => this.getCategories()
            });
    }
}
