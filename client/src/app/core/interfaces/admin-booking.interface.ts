import {IUser} from "./user.interface";
import {IRoom} from "./room.interface";

export interface IAdminBooking {
    id: number;
    start_date: string;
    end_date: string;
    created_at: string;
    user: IUser
    room: IRoom
}
