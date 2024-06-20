import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin.component";
import {AdminBookingPageComponent} from "./components/admin-booking/admin-booking-page/admin-booking-page.component";
import {AdminCategoryPageComponent} from "./components/admin-category/admin-category-page/admin-category-page.component";

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'bookings',
                component: AdminBookingPageComponent,
            },
            {
                path: 'categories',
                component: AdminCategoryPageComponent
            },
            {
                path: '**',
                redirectTo: 'bookings',
                pathMatch: 'full'
            }
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
