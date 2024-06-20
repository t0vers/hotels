import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IAdminBooking} from "../../../../core/interfaces/admin-booking.interface";
import {AdminService} from "../../../../core/services/admin.service";

@Component({
    selector: 'app-bookings-table',
    templateUrl: './admin-booking-table.component.html',
    styleUrls: ['./admin-booking-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBookingTableComponent {
    @Input({
        required: true
    })
    public dataSource!: IAdminBooking[];
    public displayedColumns: string[] = ['id', 'roomTitle', 'startDate', 'endDate', 'user', 'actions'];

    constructor(private _adminService: AdminService) { }

    public deleteBooking(id: number): void {
        this._adminService.deleteBooking(id);
    }
}
