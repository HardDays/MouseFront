import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { EventGetModel } from "../../../../core/models/eventGet.model";

@Component({
    selector: 'shows-preview-search-component',
    templateUrl: './show-preview.component.html',
    styleUrls: ['./../../search.component.css']
  })
  
  export class ShowsPreviewSearchComponent extends BaseComponent implements OnInit {
    @Input() Shows: EventGetModel[];
    @Output() ShowFullShows: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit(): void {
        
    }

    ShowAll()
    {
        this.ShowFullShows.emit('Shows');
    }
  }