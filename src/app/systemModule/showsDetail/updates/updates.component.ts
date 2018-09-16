import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { EventUpdatesModel } from '../../../core/models/eventUpdates.model';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent implements OnInit {

  @Input() UpdatesEvent:EventUpdatesModel[];
  Updates:EventUpdatesModel[] = []
  constructor() { }

  ngOnInit() {
    this.initUpdate();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initUpdate();
   
  }
  initUpdate(){
    this.Updates = this.UpdatesEvent;
  }

  calculateTime(value: Date){
    let result: string ='';
    // current time
    let now = new Date().getTime();
    let old = new Date(value).getTime();
    // time since message was sent in seconds
    let delta = (now - old) / 1000;
    // format string
    if (delta < 10) {
      result = 'just';
    } else if (delta < 60) { // sent in last minute
      result = Math.floor(delta) + ' Seconds';
    } else if (delta < 3600) { // sent in last hour
      result =Math.floor(delta / 60) + ' Minutes';
    } else if (delta < 86400) { // sent on last day
      result = Math.floor(delta / 3600) + ' Hours';
    } else { // sent more than one day ago
      result = Math.floor(delta / 86400) + ' Day';
      if(Math.floor(delta / 86400)>1)
        result+='s';
    }
    return result;
  }


  getValue(oneUpdate){
    if(oneUpdate.action == "update"){
      return "Updated "+ oneUpdate.field
    }
    else if (oneUpdate.action == "add_ticket"){
      return "Added ticket"
    }
    else if (oneUpdate.action == "add_genre"){
      return "Added Genre"
    }
    else{
      return "event has been launched"
    }
  }


}
