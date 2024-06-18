import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {IRoom} from "../../../core/interfaces/room.interface";
import {Observable} from "rxjs";
import {RoomService} from "../../../core/services/room.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    templateUrl: './room-page.component.html',
    styleUrls: ['./room-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPageComponent implements OnInit {
    // public dates: Date[] = [
    //     new Date("2024-06-21"),
    //     new Date("2024-06-22"),
    //     new Date("2024-06-24"),
    //     new Date("2024-06-18"),
    //     new Date("2024-06-19"),
    //     new Date("2024-06-23"),
    //     new Date("2024-06-20")
    // ]
    //
    // myHolidayFilter = (d: Date | null): boolean => {
    //     // Convert the date to string format for comparison
    //     const currentDate = d ? d.toDateString() : '';
    //
    //     // Check if the current date exists in the dates array
    //     return !this.dates.some(date => date.toDateString() === currentDate);
    // }
    public selectedRoom$!: Observable<IRoom>;
    private _destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
        private _route: ActivatedRoute,
        private _roomService: RoomService
    ) { }


    public ngOnInit(): void {
        this._route.params
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(
            (params: Params) => {
                this._roomService.getSelectedRoom(Number(params['id']));
                this.selectedRoom$ = this._roomService.selectedRoom;
            }
        );
    }

}
