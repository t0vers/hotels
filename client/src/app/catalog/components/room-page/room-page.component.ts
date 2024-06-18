import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {IRoom} from "../../../core/interfaces/room.interface";
import {Observable} from "rxjs";
import {RoomService} from "../../../core/services/room.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BookingService} from "../../../core/services/booking.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
    templateUrl: './room-page.component.html',
    styleUrls: ['./room-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPageComponent implements OnInit {
    public selectedRoom$!: Observable<IRoom>;
    public bookedDates$!: Observable<Date[]>;

    public controlStartDate: FormControl<string | null> = new FormControl<string>('', Validators.required);
    public controlEndDate: FormControl<string | null> = new FormControl<string>('', Validators.required);

    private _destroyRef: DestroyRef = inject(DestroyRef);



    constructor(
        private _route: ActivatedRoute,
        private _roomService: RoomService,
        private _bookingService: BookingService
    ) { }


    public ngOnInit(): void {
        this._route.params
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(
            (params: Params) => {
                this._roomService.getSelectedRoom(Number(params['id']));
                this._bookingService.getBookedDates(Number(params['id']));
                this.selectedRoom$ = this._roomService.selectedRoom;
                this.bookedDates$ = this._bookingService.bookedDates;
            }
        );
    }

    public bookingFilter = (d: Date | null): boolean => {
        let dates: Date[] = [];


        this.bookedDates$
            .pipe(
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe({
                next: (newDates: Date[]) => {
                    dates = newDates;
                }
            })

        const currentDate = d ? d.toDateString() : '';
        return !dates.some(date => date.toDateString() === currentDate);
    }

    public bookingRoom(id: number): void {
        this._bookingService.createBooking({
            room_id: id,
            start_date: this.controlStartDate.value!,
            end_date: this.controlEndDate.value!
        });
    }

}
