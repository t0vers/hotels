import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../login/login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    public registerForm: FormGroup;

    constructor(private _authService: AuthService) {
        this.registerForm = new FormGroup({
            'email': new FormControl<string>('', [Validators.required, Validators.email]),
            'username': new FormControl<string>('', [Validators.required]),
            'password': new FormControl<string>('', [Validators.required]),
        })
    }

    public submit(): void {
        this._authService.register(this.registerForm.value);
    }
}
