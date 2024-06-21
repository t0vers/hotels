import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {AdminService} from "../../../../core/services/admin.service";

export interface DialogData {
    id?: number;
    value?: string;
    type: string;
}

@Component({
    templateUrl: './admin-category-dialog.component.html',
    styleUrls: ['./admin-category-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCategoryDialogComponent implements OnInit {
    public controlValue = new FormControl<string>('', Validators.required);
    public readonly data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);
    private readonly _dialogRef = inject(MatDialogRef<AdminCategoryDialogComponent>);

    constructor(private _adminService: AdminService) { }

    public ngOnInit(): void {
        if (this.data.type === 'edit') {
            this.controlValue.setValue(this.data.value!);
        }
    }

    public fetchCategory(): void {
        if (this.data.type === 'new') {
            this._adminService.createCategory({
                value: this.controlValue.value!
            });
        } else {
            this._adminService.editCategory({
                id: this.data.id,
                value: this.controlValue.value!
            })
        }

        this.closeDialog();
    }

    public closeDialog(): void {
        this._dialogRef.close();
    }
}
