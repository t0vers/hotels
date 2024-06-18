import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {ICategory} from "../core/interfaces/category.interface";
import {RoomService} from "../core/services/room.service";
import {IRoom} from "../core/interfaces/room.interface";

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {
    public categories$!: Observable<ICategory[]>;
    public rooms$!: Observable<IRoom[]>
    public isLoading$!: Observable<boolean>;

    constructor(private _roomService: RoomService) { }

    public ngOnInit(): void {
        this.categories$ = this._roomService.categories;
        this.rooms$ = this._roomService.rooms;
        this.isLoading$ = this._roomService.isLoading;
    }
}
