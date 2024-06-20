import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookingPageComponent} from "./catalog/components/booking-page/booking-page.component";
import {AdminGuard} from "./core/guards/admin.guard";
import {AuthGuard} from "./core/guards/auth.guard";

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: 'catalog',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard]
    },
    {
        path: 'bookings',
        component: BookingPageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'catalog',
        pathMatch: 'full'
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
