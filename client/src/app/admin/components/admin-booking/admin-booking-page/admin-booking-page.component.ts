import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {IAdminBooking} from "../../../../core/interfaces/admin-booking.interface";
import {AdminService} from "../../../../core/services/admin.service";

@Component({
    templateUrl: './admin-booking-page.component.html',
    styleUrls: ['./admin-booking-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBookingPageComponent implements OnInit {
    public bookings$!: Observable<IAdminBooking[]>;

    constructor(
        private _adminService: AdminService
    ) { }

    public ngOnInit(): void {
        this._adminService.getBookings();
        this.bookings$ = this._adminService.bookings;
    }
}
