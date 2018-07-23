import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends BaseComponent implements OnInit {

  @Input() isApprovedBy;
  @Input() status;
  @Input() Accounts:AccountGetModel[];
  @Input() Events:any[];

  AccountsChecked:AccountGetModel[] = [];
  EventsChecked:any[] = [];

  openIds:number[] = [];

  TypesArtist = {
    fan: false,
    venue: false,
    artist: false,
    all: true
  }

  TypesEvent = {
    crowdfund: false,
    regular: false,
    all: true
  }

 ngOnChanges(changes: SimpleChanges): void {
    if(changes.Accounts){
        this.AccountsChecked = this.Accounts = changes.Accounts.currentValue;   
    }
    if(changes.Events){
      this.EventsChecked = this.Events = changes.Events.currentValue;   
    }

  }

  ngOnInit() {
    // console.log(this.Accounts)
  }

  openAccount(id:number){
    this.router.navigate(["/admin",'account',id])
  }

  openEvent(id:number){
    this.router.navigate(["/admin",'event',id])
  }

  checkIdToOpen(id:number){
    let index = this.openIds.indexOf(id);
    if(index<0)
      this.openIds.push(id);
    else
      this.openIds.splice(index,1);
    
      // console.log(this.openIds);

  }

  openInNewTabs(){
    let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
        window.open('http://localhost:4200/admin/'+type+'/'+id,'_blank');
        // window.open('http://mouse-web.herokuapp.com/admin/'+type+'/'+id,'_blank');
        window.blur();
      }
  }

  deleteAll(){
    let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
      if(type==='account')
      {
        this.main.adminService.AccountDelete(id)
          .subscribe(
            (res)=>{
              console.log(id,`ok`);
              this.Accounts.splice(this.Accounts.indexOf(this.Accounts.find((a)=>a.id===id)),1)
            },
            (err)=>{
              console.log(`err`,err);
            }
          )
      }
      else {
        this.main.adminService.EventDelete(id)
          .subscribe(
            (res)=>{
              console.log(id,`ok`);
              this.Events.splice(this.Events.indexOf(this.Events.find((e)=>e.id===id)),1)
            },
            (err)=>{
              console.log(`err`,err);
            }
          )
      }
        
    }
  }

  getImage(id:number){
    let img = '';
    if(id){
      
      img = this.main.imagesService.GetImagePreview(id,{width:50,height:50})
          
    }
    else
      img = BaseImages.NoneFolowerImage;

    return  {'background-image': 'url('+img+')'};
  }
  // {'background-image': Account.acc.image_id?'url('+Account.image_base64_not_given+')':''}

  filterByName(event){
    let searchParam = event.target.value;
        if(searchParam){

          this.TypesArtist = {artist:false,venue:false,fan:false,all:true};
          this.TypesEvent = {crowdfund:false, regular:false, all:true};

          if(this.Accounts){
            this.AccountsChecked = this.Accounts.filter(obj => obj.display_name && obj.display_name.indexOf(searchParam)>=0);
          }
          if(this.Events){
            this.EventsChecked = this.Events.filter(obj => obj.name && obj.name.indexOf(searchParam)>=0);
          }
        }
        else{
          if(this.Accounts){
            this.AccountsChecked = this.Accounts;
          }
          if(this.Events){
            this.EventsChecked = this.Events;
          }
        }      
  }

  filterByType(){
    if(this.Accounts){
      
      if(!this.TypesArtist.artist&&!this.TypesArtist.fan&&!this.TypesArtist.venue)
        this.TypesArtist.all = true;
  
      if(this.TypesArtist.all){
        this.AccountsChecked = this.Accounts;
      }
      else
      {
        this.TypesArtist.all = false;
        this.AccountsChecked = this.Accounts.filter(
            obj => obj.account_type && ( 
              this.TypesArtist.fan && obj.account_type === 'fan' ||
              this.TypesArtist.venue && obj.account_type === 'venue' ||
              this.TypesArtist.artist && obj.account_type === 'artist'
            )
        );
      }
    }
    if(this.Events){
      if(!this.TypesEvent.crowdfund&&!this.TypesEvent.regular)
      this.TypesEvent.all = true;

      if(this.TypesEvent.all){
        this.EventsChecked = this.Events;
      }
      else
      {
        this.TypesEvent.all = false;
        this.EventsChecked = this.Events.filter(
            obj => 
              this.TypesEvent.crowdfund && obj.is_crowdfunding_event ||
              this.TypesEvent.regular && !obj.is_crowdfunding_event
        );
      }
    }
    
  }

}
