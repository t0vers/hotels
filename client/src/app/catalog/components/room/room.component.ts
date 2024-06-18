import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IRoom} from "../../../core/interfaces/room.interface";

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
}
