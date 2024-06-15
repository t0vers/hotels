import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
    public loginForm: FormGroup;

    constructor() {
        this.loginForm = new FormGroup({
            email: new FormControl<string>('', [Validators.required, Validators.email]),
            password: new FormControl<string>('', [Validators.required])
        })
    }
}
