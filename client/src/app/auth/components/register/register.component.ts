import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../login/login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    public registerForm!: FormGroup;

    public submit(): void {

    }
}
