import {NgModule} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AdminComponent} from "./admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {SidenavComponent} from "./components/sidenav/sidenav.component";
import {AdminBookingPageComponent} from "./components/admin-booking/admin-booking-page/admin-booking-page.component";
import {provideHttpClient} from "@angular/common/http";
import {AsyncPipe, DatePipe} from "@angular/common";
import {CatalogModule} from "../catalog/catalog.module";
import {AdminBookingTableComponent} from "./components/admin-booking/admin-booking-table/admin-booking-table.component";
import {MatTableModule} from "@angular/material/table";
import {AdminService} from "../core/services/admin.service";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import {AdminCategoryPageComponent} from "./components/admin-category/admin-category-page/admin-category-page.component";
import {
    AdminCategoryTableComponent
} from "./components/admin-category/admin-category-table/admin-category-table.component";
import {
    AdminCategoryDialogComponent
} from "./components/admin-category/admin-category-dialog/admin-category-dialog.component";
import {MatDialogContent, MatDialogModule} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {AdminRoomPageComponent} from "./components/admin-room/admin-room-page/admin-room-page.component";
import {AdminRoomComponent} from "./components/admin-room/admin-room/admin-room.component";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle, MatCardTitle
} from "@angular/material/card";
import {AdminRoomDialog} from "./components/admin-room/admin-room-dialog/admin-room-dialog.component";
import {MatOption, MatSelect} from "@angular/material/select";

@NgModule({
    declarations: [
        AdminComponent,
        SidenavComponent,
        AdminBookingPageComponent,
        AdminBookingTableComponent,
        AdminCategoryPageComponent,
        AdminCategoryTableComponent,
        AdminCategoryDialogComponent,
        AdminRoomPageComponent,
        AdminRoomComponent,
        AdminRoomDialog
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
        MatTooltip,
        MatDialogModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardImage,
        MatCardSubtitle,
        MatCardTitle,
        MatSelect,
        MatOption,
    ],
    providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        AdminService,
    ],
})
export class AdminModule { }
