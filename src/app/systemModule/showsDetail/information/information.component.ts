import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  EventData: EventGetModel = new EventGetModel();
  ArtistsData:AccountGetModel[] = [];
  ActiveTabIndexVal: number = 0;

  @Input() Event: EventGetModel;
  @Input() Artists: AccountGetModel[];
  
  constructor() { }
  
  ngOnInit() {
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.Event.id){
      this.EventData = this.Event;
    }
    this.ArtistsData = this.Artists;

  }
  ActiveTabIndex(i){
    this.ActiveTabIndexVal = i;
  }

}
