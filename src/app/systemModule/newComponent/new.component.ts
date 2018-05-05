import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { BaseComponent } from "../../core/base/base.component";

@Component({
    selector: 'new-component',
    templateUrl: './new.component.html'
})
export class NewComponent extends BaseComponent implements OnInit, AfterViewChecked 
{

    ngAfterViewChecked(): void {
    }
    ngOnInit(): void {
    }
}