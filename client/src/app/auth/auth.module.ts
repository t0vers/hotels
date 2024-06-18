import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {AuthComponent} from "./auth.component";
import {AuthRoutingModule} from "./auth-routing.module";
import {AuthService} from "../core/services/auth.service";
import {provideHttpClient} from "@angular/common/http";
import {RegisterComponent} from "./components/register/register.component";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        AuthComponent
    ],
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatButton,
        AuthRoutingModule,
    ],
    providers: [
        AuthService,
        provideHttpClient()
    ]
})
export class AuthModule { }
