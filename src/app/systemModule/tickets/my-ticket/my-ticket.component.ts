import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import * as moment from 'moment';



@Component({
  selector: 'app-my-ticket',
  templateUrl: './my-ticket.component.html',
  styleUrls: ['./my-ticket.component.css']
})
export class MyTicketComponent extends BaseComponent implements OnInit {

  @Input() Ticket: TicketsGetModel;
  Image:string = BaseImages.Drake;
  Date:string = "";

  ngOnInit(): void 
  {
      this.GetImage();
      this.SetDate();
  }


  GetImage()
  {
      if(this.Ticket && this.Ticket.image_id)
      {
          this.WaitBeforeLoading(
              () => this.main.imagesService.GetImageById(this.Ticket.image_id),
              (res:Base64ImageModel) => {
                  this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
              }
          );
      }
  }
  ToUppercaseLetter(date, format) : string{
    let formDate = moment(date).format(format);
    return formDate[0].toUpperCase() + formDate.substr(1) + ' ';
    }

    SetDate()
    {   
        this.isEnglish() != true?moment.locale('ru'):moment.locale('en');
        this.Date = "";
   
        const dateTimeFromat = "DD, YYYY ";
    
    
        if(!this.Ticket.date_from && !this.Ticket.date_to)
        {
            this.Date = this.GetTranslateString(this.Ticket.event_season) + ' ' + this.Ticket.event_year;
            if(this.Ticket.event_time)
            {
            this.Date = this.Date + " - <span>"+this.GetTranslateString(this.Ticket.event_time)+"</span>"
            }


        }
        else if (this.Ticket.date_from && this.Ticket.date_to)
        {
            const dateFrom = this.ToUppercaseLetter(this.Ticket.date_from,'dddd')
                + this.ToUppercaseLetter(this.Ticket.date_from,'MMM')
                + moment(this.Ticket.date_from).format(dateTimeFromat)

            const dateTo = this.ToUppercaseLetter(this.Ticket.date_to,'dddd')
                + this.ToUppercaseLetter(this.Ticket.date_to,'MMM')
                + moment(this.Ticket.date_to).format(dateTimeFromat)

            let from = this.Ticket.date_from.split("T")[0];            
            let to = this.Ticket.date_to.split("T")[0];
            if(from === to){
                // let m = moment(this.Event.date_from);
                // this.Date = m.format(dateTimeFromat);
                this.Date = dateFrom;
            
                //this.Date = date.toLocaleDateString('EEEE, MMM d, yyyy HH:mm');
            }
            else{
                this.Date = dateFrom  + " - " + dateTo;
            }
        }
    
    }
}
