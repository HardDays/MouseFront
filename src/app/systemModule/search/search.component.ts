import { Component, OnInit } from "../../../../node_modules/@angular/core";
import { BaseComponent } from "../../core/base/base.component";

declare var $:any;

@Component({
  selector: 'global-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class GlobalSearchComponent extends BaseComponent implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}