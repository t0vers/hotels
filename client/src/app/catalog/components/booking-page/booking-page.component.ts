import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {BookingService} from "../../../core/services/booking.service";
import {IBooking} from "../../../core/interfaces/booking.interface";
import {Observable, of} from "rxjs";

@Component({
    templateUrl: './booking-page.component.html',
    styleUrls: ['./booking-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingPageComponent implements OnInit {
    public bookings$!: Observable<IBooking[]>;

    constructor(private _bookingService: BookingService) { }

    public ngOnInit(): void {
        this._bookingService.getUserBookings();
        this.bookings$ = this._bookingService.userBookings;
    }
}
