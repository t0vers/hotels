import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {ICategory} from "../../../core/interfaces/category.interface";
import {Observable} from "rxjs";

@Component({
    selector: 'app-category-grid',
    templateUrl: './category-grid.component.html',
    styleUrls: ['category-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryGridComponent {
    @Input({
        required: true
    })
    public categories$!: Observable<ICategory[]>;
}
