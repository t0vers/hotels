import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {AuthComponent} from "./auth.component";
import {RegisterComponent} from "./components/register/register.component";
import {VerifyComponent} from "./components/verify/verify.component";

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'verify',
                component: VerifyComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
