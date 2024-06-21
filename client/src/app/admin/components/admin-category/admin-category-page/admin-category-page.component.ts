import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {AdminService} from "../../../../core/services/admin.service";
import {Observable} from "rxjs";
import {ICategory} from "../../../../core/interfaces/category.interface";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AdminCategoryDialogComponent} from "../admin-category-dialog/admin-category-dialog.component";

@Component({
    templateUrl: './admin-category-page.component.html',
    styleUrls: ['./admin-category-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoryPageComponent implements OnInit {
    public categories$!: Observable<ICategory[]>;

    constructor(
        private _adminService: AdminService,
        private _dialog: MatDialog
    ) { }

    public ngOnInit(): void {
        this._adminService.getCategories();
        this.categories$ = this._adminService.categories;
    }

    public createCategory(): void {
        this._dialog.open(AdminCategoryDialogComponent, {
           data: {
               type: 'new'
           }
        });
    }
}
