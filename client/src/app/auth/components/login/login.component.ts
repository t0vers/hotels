import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public loginForm: FormGroup;

    constructor(private _authService: AuthService) {
        this.loginForm = new FormGroup({
            email: new FormControl<string>('', [Validators.required, Validators.email]),
            password: new FormControl<string>('', [Validators.required])
        })
    }

    public submit(): void {
        this._authService.login({
            username: this.loginForm.controls['email'].value,
            password: this.loginForm.controls['password'].value
        });
    }
}
