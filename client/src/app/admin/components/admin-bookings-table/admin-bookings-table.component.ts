import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IAdminBooking} from "../../../core/interfaces/admin-booking.interface";
import {AdminService} from "../../../core/services/admin.service";

@Component({
    selector: 'app-bookings-table',
    templateUrl: './admin-bookings-table.component.html',
    styleUrls: ['./admin-bookings-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBookingsTableComponent {
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
