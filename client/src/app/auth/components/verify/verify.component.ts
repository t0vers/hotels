import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss', '../login/login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent {
    public token = new FormControl<string>('', Validators.required);

    constructor(
        private _authService: AuthService
    ) { }

    public submit(): void {
        this._authService.verify(this.token.value!);
    }
}
