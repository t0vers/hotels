import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {IRoom} from "../../../core/interfaces/room.interface";
import {combineLatest, Observable, startWith} from "rxjs";
import {RoomService} from "../../../core/services/room.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BookingService} from "../../../core/services/booking.service";
import {FormControl, Validators} from "@angular/forms";
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
    templateUrl: './room-page.component.html',
    styleUrls: ['./room-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPageComponent implements OnInit {
    public selectedRoom$!: Observable<IRoom>;
    public bookedDates$!: Observable<Date[]>;

    public controlStartDate: FormControl = new FormControl('', Validators.required);
    public controlEndDate: FormControl = new FormControl('', Validators.required);

    public fullDays: number = 0;

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

        combineLatest([
            this.controlStartDate.valueChanges.pipe(startWith(this.controlStartDate.value)),
            this.controlEndDate.valueChanges.pipe(startWith(this.controlEndDate.value))
        ])
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this.fullDays = this.calculateDays())
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
            start_date: moment(this.controlStartDate.value!).format('yyyy-MM-DD'),
            end_date: moment(this.controlEndDate.value!).format('yyyy-MM-DD')
        });
    }

    public calculateDays(): number {
        return moment(this.controlEndDate.value).diff(moment(this.controlStartDate.value), "days");
    }

}
