import {DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {ICategory} from "../interfaces/category.interface";
import {environment} from "../../../environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IRoom} from "../interfaces/room.interface";

@Injectable()
export class RoomService {
    private _destroyRef: DestroyRef = inject(DestroyRef);
    private _categories$: BehaviorSubject<ICategory[]> = new BehaviorSubject<ICategory[]>([]);
    private _rooms$: BehaviorSubject<IRoom[]> = new BehaviorSubject<IRoom[]>([]);

    constructor(private _http: HttpClient) {
        this.getCategories();
        this.getRooms();
    }

    public get categories(): Observable<ICategory[]> {
        return this._categories$.asObservable();
    }

    public get rooms(): Observable<IRoom[]> {
        return  this._rooms$.asObservable();
    }

    public getCategories(): void {
        this._http.get<ICategory[]>(`${environment.apiCatalogUrl}/categories`)
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (categories: ICategory[]) => {
                    this._categories$.next(categories);
                }
            });
    }

    public getRooms(categoryId: number = 0): void {
        this._http.get<IRoom[]>(`${environment.apiCatalogUrl}/rooms`,
            { params: { category_id: categoryId } }
        )
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (rooms: IRoom[]) => {
                    this._rooms$.next(rooms);
                }
            });
    }
}
