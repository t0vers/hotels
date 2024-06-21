import {ChangeDetectionStrategy, Component, NgZone} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
    constructor( private router: Router , public zone: NgZone) {}

    public navigateToRooms(): void {

        this.zone.run(() => { this.router.navigate(['/admin/rooms']) } );

    }

    public navigateToBookings(): void {
        this.zone.run(() => { this.router.navigate(['/admin/bookings']) } );
    }

    public navigateToCategories(): void {
        this.zone.run(() => { this.router.navigate(['/admin/categories']) } );
    }
}
