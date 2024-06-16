import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {provideHttpClient} from "@angular/common/http";
import {CatalogComponent} from "./catalog.component";

@NgModule({
    declarations: [
        CatalogComponent
    ],
    imports: [
        ReactiveFormsModule,
    ],
    providers: [
        provideHttpClient()
    ]
})
export class AuthModule { }
