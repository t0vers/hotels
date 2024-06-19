import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {BookingService} from "../../../core/services/booking.service";
import {IBooking} from "../../../core/interfaces/booking.interface";
import {Observable} from "rxjs";

@Component({
    templateUrl: './admin-booking-page.component.html',
    styleUrls: ['./admin-booking-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBookingPageComponent implements OnInit {
    public bookings$!: Observable<IBooking[]>;

    constructor(private _bookingService: BookingService) { }

    public ngOnInit(): void {
        this._bookingService.getUserBookings();
        this.bookings$ = this._bookingService.userBookings;
    }
}
