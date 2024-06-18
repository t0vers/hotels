import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CatalogComponent} from "./catalog.component";
import {RoomPageComponent} from "./components/room-page/room-page.component";

const routes: Routes = [
    {
        path: '',
        component: CatalogComponent
    },
    {
        path: ':id',
        component: RoomPageComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule { }
