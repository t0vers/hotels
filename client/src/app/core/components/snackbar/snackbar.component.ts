import {ChangeDetectionStrategy, Component, Inject} from "@angular/core";
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SnackbarComponent {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) { }
}
