import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IRoom} from "../../../core/interfaces/room.interface";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {
    @Input({
        required: true
    })
    public room!: IRoom;

    constructor(
        private _router: Router,
        private _authService: AuthService
    ) { }

    public openRoomPage(id: number): void {
        this._router.navigate([`catalog/${id}`]);
    }
}
