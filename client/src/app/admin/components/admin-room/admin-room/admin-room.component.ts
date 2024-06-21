import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IRoom} from "../../../../core/interfaces/room.interface";
import {MatDialog} from "@angular/material/dialog";
import {AdminService} from "../../../../core/services/admin.service";
import {AdminRoomDialog} from "../admin-room-dialog/admin-room-dialog.component";

@Component({
    selector: 'app-admin-room',
    templateUrl: './admin-room.component.html',
    styleUrls: ['./admin-room.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRoomComponent {
    @Input({
        required: true
    })
    public room!: IRoom;

    constructor(
        private _dialog: MatDialog,
        private _adminService: AdminService
    ) {
    }

    public deleteRoom(id: number): void {
        this._adminService.deleteRoom(id);
    }

    public editRoom(): void {
        this._dialog.open(AdminRoomDialog,{
            data: {
                ...this.room,
                type: 'edit'
            }
        })
    }
}
