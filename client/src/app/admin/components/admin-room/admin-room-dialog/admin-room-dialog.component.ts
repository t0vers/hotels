import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {AdminService} from "../../../../core/services/admin.service";
import {ICategory} from "../../../../core/interfaces/category.interface";
import {Observable} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface DialogData {
    id?: number;
    title?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    images?: string[];
    type: string;
}

@Component({
    templateUrl: './admin-room-dialog.component.html',
    styleUrls: ['./admin-room-dialog.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRoomDialog implements OnInit {
    public categories$!: Observable<ICategory[]>;

    public controlTitle = new FormControl<string>('', Validators.required);
    public controlDescription = new FormControl<string>('', Validators.required);
    public controlPrice = new FormControl<number>(0, Validators.required);
    public controlCategoryId = new FormControl<number>(0, Validators.required);
    public controlImages = new FormControl<string>('', Validators.required);

    public readonly data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);
    private _destroyRef: DestroyRef = inject(DestroyRef)
    private readonly _dialogRef = inject(MatDialogRef<AdminRoomDialog>);

    constructor(private _adminService: AdminService) { }

    public ngOnInit(): void {
        this._adminService.getCategories();
        this.categories$ = this._adminService.categories;

        if (this.data.type === 'edit') {
            this.controlTitle.setValue(this.data.title!);
            this.controlDescription.setValue(this.data.description!);
            this.controlPrice.setValue(this.data.price!);
            this.controlCategoryId.setValue(this.data.categoryId!);
            this.controlImages.setValue(this.data.images![0]);
        }
    }

    public fetchRoom(): void {
        if (this.data.type === 'new') {
            this._adminService.createRoom({
                title: this.controlTitle.value!,
                description: this.controlDescription.value!,
                price: this.controlPrice.value!,
                category_id: this.controlCategoryId.value!,
                images: [this.controlImages.value!]
            });
        } else {
            this._adminService.editRoom({
                id: this.data.id,
                title: this.controlTitle.value!,
                description: this.controlDescription.value!,
                price: this.controlPrice.value!,
                category_id: this.controlCategoryId.value!,
                images: [this.controlImages.value!]
            })
        }

        this.closeDialog();
    }

    public closeDialog(): void {
        this._dialogRef.close();
        location.reload();
    }
}
