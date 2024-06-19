import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BookingPageComponent} from "./catalog/components/booking-page/booking-page.component";

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'catalog',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
    },
    {
        path: 'bookings',
        component: BookingPageComponent
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
