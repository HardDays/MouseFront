import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { EventGetModel } from '../../../../core/models/eventGet.model';

@Component({
    selector: 'shows-full-search-component',
    templateUrl: './shows-full.component.html',
    styleUrls: ['./../../search.component.css']
  })
  
  export class ShowsFullSearchComponent extends BaseComponent implements OnInit {
    @Input() Shows: EventGetModel[];
    ngOnInit(): void {
        
    }

  }