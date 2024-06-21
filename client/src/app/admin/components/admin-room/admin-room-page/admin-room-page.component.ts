import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {AdminService} from "../../../../core/services/admin.service";
import {Observable} from "rxjs";
import {IRoom} from "../../../../core/interfaces/room.interface";
import {MatDialog} from "@angular/material/dialog";
import {AdminRoomDialog} from "../admin-room-dialog/admin-room-dialog.component";

@Component({
    templateUrl: './admin-room-page.component.html',
    styleUrls: ['./admin-room-page.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRoomPageComponent implements OnInit {
    public rooms$!: Observable<IRoom[]>


    constructor(
        private _adminService: AdminService,
        private _dialog: MatDialog
    ) { }

    public ngOnInit(): void {
        this._adminService.getRooms();
        this.rooms$ = this._adminService.rooms;
    }

    public createRoom(): void {
        this._dialog.open(AdminRoomDialog, {
            data: {
                type: 'new'
            }
        })
    }
}
