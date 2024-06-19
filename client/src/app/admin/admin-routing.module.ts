import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin.component";
import {AdminBookingPageComponent} from "./components/admin-booking-page/admin-booking-page.component";

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'asas',
                component: AdminBookingPageComponent,
            },
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
