import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {IBooking} from "../../../core/interfaces/booking.interface";
import {IRoom} from "../../../core/interfaces/room.interface";
import {RoomService} from "../../../core/services/room.service";
import {Observable} from "rxjs";
import {BookingService} from "../../../core/services/booking.service";

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnInit {
    @Input({
        required: true
    })
    public booking!: IBooking;
    public room$!: Observable<IRoom>;

    constructor(
        private _roomService: RoomService,
        private _bookingService: BookingService
    ) { }

    public ngOnInit(): void {
        if (this.booking) {
            this.room$ = this._roomService.getRoom(this.booking.room_id)
        }
    }

    public deleteBooking(id: number): void {
        this._bookingService.deleteBooking(id);
    }

}
