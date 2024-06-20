import {NgModule} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AdminComponent} from "./admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {SidenavComponent} from "./components/sidenav/sidenav.component";
import {AdminBookingPageComponent} from "./components/admin-booking-page/admin-booking-page.component";
import {provideHttpClient} from "@angular/common/http";
import {AsyncPipe, DatePipe} from "@angular/common";
import {CatalogModule} from "../catalog/catalog.module";
import {AdminBookingsTableComponent} from "./components/admin-bookings-table/admin-bookings-table.component";
import {MatTableModule} from "@angular/material/table";
import {AdminService} from "../core/services/admin.service";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";

@NgModule({
    declarations: [
        AdminComponent,
        SidenavComponent,
        AdminBookingPageComponent,
        AdminBookingsTableComponent
    ],
    imports: [
        AdminRoutingModule,
        AsyncPipe,
        CatalogModule,
        MatTableModule,
        DatePipe,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatTooltip
    ],
    providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        AdminService,
    ],
})
export class AdminModule { }
