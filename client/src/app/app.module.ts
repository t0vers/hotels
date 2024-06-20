import {NgModule, OnInit} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {SnackbarComponent} from "./core/components/snackbar/snackbar.component";
import {AuthService} from "./core/services/auth.service";
import {provideHttpClient} from "@angular/common/http";
import {BookingService} from "./core/services/booking.service";
import {RoomService} from "./core/services/room.service";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SnackbarComponent
    ],
    providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        AuthService,
        BookingService,
        RoomService
    ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
