import {ChangeDetectionStrategy, Component} from "@angular/core";
import {MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatMiniFabButton,
        MatIcon
    ],
    standalone: true
})
export class HeaderComponent { }
