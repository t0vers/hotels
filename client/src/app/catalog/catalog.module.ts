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
import {AsyncPipe} from "@angular/common";
import {RoomService} from "../core/services/room.service";

@NgModule({
    declarations: [
        CatalogComponent,
        RoomComponent,
        CategoryGridComponent
    ],
    imports: [
        ReactiveFormsModule,
        CatalogRoutingModule,
        MainLayoutComponent,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        AsyncPipe
    ],
    providers: [
        provideHttpClient(),
        RoomService
    ]
})
export class CatalogModule { }
