import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
  selector: 'app-one-card',
  templateUrl: './one-card.component.html',
  styleUrls: ['./one-card.component.css']
})
export class OneCardComponent implements OnInit {

  @Input('card') card: AccountGetModel;
  @Input('status') status: string;
  @Input('price') price: number;

  @Output('accepted') accept = new EventEmitter<number>();
  @Output('requested') requested = new EventEmitter<AccountGetModel>();
  @Output('declined') declined = new EventEmitter<number>();
  @Output('checked') checked = new EventEmitter();

  ngOnInit() {
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

  acceptArtist(index:number){
    this.accept.emit(index);
  }
  sendRequest(){
    this.requested.emit(this.card);
  }
  declineArtist(index:number){
    this.declined.emit(index);
  }
  checkArtist(){
    this.checked.emit();
  }

}
