import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {  }
