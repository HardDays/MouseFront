import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { AccountGetModel } from '../../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../../core/models/eventGet.model";
import { GenreModel } from "../../../../core/models/genres.model";
import { BaseImages } from "../../../../core/base/base.enum";

@Component({
  selector: 'app-fan',
  templateUrl: './fan.component.html',
  styleUrls: ['./fan.component.css']
})
export class FanComponent extends BaseComponent implements OnInit {

      @Input() Account: AccountGetModel;
      @Input() IsMyAccount:boolean;
      @Input() isFolowedAcc:boolean;
      @Input() MyProfileId: number;
  
      isPreloadTickets:boolean = false;
      isPreloadEvents:boolean = false;
      TotalTicket:number = 0;
      TicketMass:TicketsGetModel[] = [];
      ticketsMassChecked:TicketsGetModel[] = [];
      genres:GenreModel[] = [];
      EventsMass:EventGetModel[] = [];
      EventsMassChecked:EventGetModel[] = [];
  
      FansChecked:AccountGetModel[] = [];
      
      Image:string='';
      Fans:AccountGetModel[]=[];
  
      // ngOnChanges(changes: SimpleChanges): void {
      //     if(changes.Account)
      //     {
      //         this.Account = changes.Account.currentValue;
      //     }
      //     if(changes.MyProfileId){
      //         this.MyProfileId = changes.MyProfileId.currentValue;
      //     }
      //     if(changes.Fans){
      //         this.FansChecked = this.Fans = changes.Fans.currentValue;
              
      //     }    
      //     // this.InitByUser();
      // }
      
      ngOnInit(): void {
          this.InitByUser();
          
      }
  
      InitByUser()
      {
        if(this.Account.image_id){
          this.main.imagesService.GetImageById(this.Account.image_id)
            .subscribe((img)=>{
              this.Image = img.base64;
            },(err)=>{
              this.Image = BaseImages.NoneFolowerImage;
            })
        }
        else{
          this.Image = BaseImages.NoneFolowerImage;
        }
        this.GetTickets();
        this.GetEvents();
        this.GetFans();
      }
  
      CountTickets()
      {
          this.TotalTicket = 0;
          for(let item of this.TicketMass)
          {
              this.TotalTicket += item.tickets_count;
          }
      }
      GetTickets()
      {
          this.ticketsMassChecked = this.TicketMass = [];
          if(this.Account.id)
          {
              this.isPreloadTickets = true;
                  this.main.eventService.GetAllTicketswithoutCurrent(this.Account.id)
                  .subscribe(
                  (res:TicketsGetModel[]) =>
                  {
                      this.ticketsMassChecked = this.TicketMass = res;
                      this.CountTickets();
                      this.isPreloadTickets = false;
                  },
                  (err) => {
                  }
              );
          }
          else 
              this.CountTickets();
      }
  
      searchTickets(event)
      {
          let searchParam = event.target.value;
          if(searchParam)
              this.ticketsMassChecked = this.TicketMass.filter(obj => obj.name && obj.name.indexOf(searchParam)>=0);
          else this.ticketsMassChecked = this.TicketMass;
      }
  
      GetEvents()
      {
          this.EventsMassChecked = this.EventsMass = [];
          if(this.Account.id)
          {
              
                  this.main.eventService.GetEvents(this.Account.id).subscribe(
                  (res:EventGetModel[]) => {
                      this.EventsMassChecked = this.EventsMass = res;
                  },
                  (err) => {
                  }
              );
          }
      }
  
      searchEvents(event)
      {
          let searchParam = event.target.value;
          if(searchParam)
              this.EventsMassChecked = this.EventsMass.filter(obj => obj.name.indexOf(searchParam)>=0);
          else this.EventsMassChecked = this.EventsMass;
      }
  
      searchFans(event)
      {
          let searchParam = event.target.value;
          if(searchParam)
              this.FansChecked = this.Fans.filter(obj => obj.user_name.indexOf(searchParam)>=0);
          else this.FansChecked = this.Fans;
      }


      GetFans(){
        this.Fans = [];
        this.WaitBeforeLoading(
            () => this.main.accService.GetAcauntFolowers(this.Account.id),
            (res:any) =>
            {
                this.Fans = res.followers;
            },
            (err) => {
            
            }
        );
      }

  }