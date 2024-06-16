import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CatalogComponent} from "./catalog.component";

const routes: Routes = [
    {
        path: '',
        component: CatalogComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule { }
