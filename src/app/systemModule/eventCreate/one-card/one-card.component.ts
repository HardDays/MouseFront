import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-one-card',
  templateUrl: './one-card.component.html',
  styleUrls: ['./one-card.component.css']
})
export class OneCardComponent implements OnInit {

  @Input('card') card: AccountGetModel;
  @Input('status') status: string;
  @Input('price') price: number;

  @Output('accepted') accept = new EventEmitter<AccountGetModel>();
  @Output('requested') requested = new EventEmitter<AccountGetModel>();
  @Output('declined') declined = new EventEmitter<AccountGetModel>();
  @Output('checked') checked = new EventEmitter();

  // @Output('addVenue') addVenue = new EventEmitter<AccountGetModel>();

  ngOnInit() {
    console.log(this.card, this.status);
  }

  toBeatyShowsList( mas:any[]){
    let list: string = '';
    for(let item of mas)
        list+= item.toUpperCase()+", ";
    let answer = '';
    for(let i=0;i<list.length-2;i++)
        if(list[i]!="_") answer += list[i];
        else answer += " ";
    return answer;
  }

  Accept(index:number){
    this.accept.emit(this.card);
  }
  sendRequest(){
    this.requested.emit(this.card);
  }
  Decline(index:number){
    this.declined.emit(this.card);
  }
  Check(){
    this.checked.emit();
  }
  

}
