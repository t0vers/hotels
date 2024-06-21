import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {IAdminBooking} from "../../../../core/interfaces/admin-booking.interface";
import {AdminService} from "../../../../core/services/admin.service";
import {ICategory} from "../../../../core/interfaces/category.interface";
import {MatDialog} from "@angular/material/dialog";
import {AdminCategoryDialogComponent} from "../admin-category-dialog/admin-category-dialog.component";

@Component({
    selector: 'app-category-table',
    templateUrl: './admin-category-table.component.html',
    styleUrls: ['./admin-category-table.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoryTableComponent {
    @Input({
        required: true
    })
    public dataSource!: ICategory[];
    public displayedColumns: string[] = ['id', "value", 'actions'];

    constructor(
        private _adminService: AdminService,
        private _dialog: MatDialog
    ) { }

    public deleteCategory(id: number): void {
        this._adminService.deleteCategory(id);
    }

    public editCategory(category: ICategory): void {
        this._dialog.open(AdminCategoryDialogComponent, {
            data: {
                id: category.id,
                value: category.value,
                type: 'edit'
            }
        });
    }
}
