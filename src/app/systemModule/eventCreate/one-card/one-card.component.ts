import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { BaseComponent } from '../../../core/base/base.component';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-one-card',
  templateUrl: './one-card.component.html',
  styleUrls: ['./one-card.component.css']
})
export class OneCardComponent extends BaseComponent implements OnInit {

  @Input('card') card: AccountGetModel;
  @Input('status') status: string;
  @Input('price') price: number;
  @Input('currency') currency: string;
  // @Input('messageId') messageId: number;

  @Output('accepted') accept = new EventEmitter<AccountGetModel>();
  @Output('requested') requested = new EventEmitter<AccountGetModel>();
  @Output('declined') declined = new EventEmitter<AccountGetModel>();
  @Output('checked') checked = new EventEmitter();
  @Output('open') open = new EventEmitter<number>();


  CurrencySymbol = '$';
  // @Output('addVenue') addVenue = new EventEmitter<AccountGetModel>();

  emptyImage = BaseImages.NoneUserImage;

  ngOnInit() {

    
    // console.log(this.currency);
    this.CurrencySymbol = CurrencyIcons[this.currency];
    // this.getPrice();

    // console.log(`card`,this.card, this.status);
  }
  ngOnChanges(change:SimpleChanges){
    if(change.currency){
      this.currency = change.currency.currentValue;
      this.CurrencySymbol = CurrencyIcons[this.currency];
    }
    if(change.price){
      this.price = change.price.currentValue;
    }
    
  }


  toBeatyShowsList( mas:any[]){
    let list: string = '';
    for(let item of mas)
        list+= item.toUpperCase()+", ";
    let answer = '';
    for(let i=0;i<list.length-2;i++)
        if(list[i]!="_") answer += list[i];
        else answer += " ";
    return answer.replace('_',' ');
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

  niceViewGenres(g:string[]){
    let gnr = '';
    if(g){
        if(g[0]) gnr+=g[0].replace('_',' ');
        if(g[1]) gnr+=', '+g[1].replace('_',' ');
    }

   return gnr;
  }

  niceViewGenre(g:string){
      return g.replace('_',' ');
  }

  openArtist(){
    this.open.emit(this.card.id);
  }

  

}
