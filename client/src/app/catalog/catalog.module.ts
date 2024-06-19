import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {provideHttpClient} from "@angular/common/http";
import {CatalogComponent} from "./catalog.component";
import {CatalogRoutingModule} from "./catalog-routing.module";
import {MainLayoutComponent} from "../core/layouts/main-layout.component";
import {RoomComponent} from "./components/room/room.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CategoryGridComponent} from "./components/category/category-grid.component";
import {MatChipsModule} from "@angular/material/chips";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {RoomService} from "../core/services/room.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RoomPageComponent} from "./components/room-page/room-page.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";
import {AuthService} from "../core/services/auth.service";
import {BookingService} from "../core/services/booking.service";
import {BookingComponent} from "./components/booking/booking.component";
import {BookingPageComponent} from "./components/booking-page/booking-page.component";

@NgModule({
    declarations: [
        CatalogComponent,
        RoomComponent,
        CategoryGridComponent,
        RoomPageComponent,
        BookingComponent,
        BookingPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        CatalogRoutingModule,
        MainLayoutComponent,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        AsyncPipe,
        MatProgressSpinner,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        NgIf,
        DatePipe
    ],
    exports: [
        BookingComponent
    ],
    providers: [
        provideHttpClient(),
        provideNativeDateAdapter(),
        RoomService,
        AuthService,
        BookingService,
    ]
})
export class CatalogModule { }
