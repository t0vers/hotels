import {NgModule} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AdminComponent} from "./admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {MatButton} from "@angular/material/button";
import {SidenavComponent} from "./components/sidenav/sidenav.component";
import {AdminBookingPageComponent} from "./components/admin-booking-page/admin-booking-page.component";
import {provideHttpClient} from "@angular/common/http";
import {AsyncPipe} from "@angular/common";
import {CatalogModule} from "../catalog/catalog.module";

@NgModule({
    declarations: [
        AdminComponent,
        SidenavComponent,
        AdminBookingPageComponent,
    ],
    imports: [
        AdminRoutingModule,
        AsyncPipe,
        MatButton,
        CatalogModule
    ],
    providers: [
        provideAnimationsAsync(),
        provideHttpClient()
    ],
})
export class AdminModule { }
