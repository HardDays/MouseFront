import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import * as moment from 'moment';
import { TimeFormat } from '../../../core/models/preferences.model';


@Component({
    selector: 'shows-item-selector',
    templateUrl: './show.component.html',
    styleUrls: [ './../shows.component.css']
})
export class ShowItemComponent extends BaseComponent implements OnChanges {
    
    @Input() Show: EventGetModel;
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;
    Date:string = "";
    IsPromotional = false;

    Address = '';

    ngOnChanges(changes: SimpleChanges): void 
    {
        this.GetExtendedEvent();
    }

    GetExtendedEvent()
    {
        if(this.Show && this.Show.id && this.Show.creator_id)
        {
            this.main.eventService.GetEventById(this.Show.id)
                .subscribe(
                    (res:any) =>{
                        this.Show = res;
                        if(this.Show.is_crowdfunding_event)
                        {
                            this.FoundedPercent = +(100*(this.Show.founded?this.Show.founded:0) / (this.Show.funding_goal?this.Show.funding_goal:0.01)).toFixed(1);
                            
                        }

                        if(this.Show.tickets && this.Show.tickets.length > 0)
                        {
                            this.IsPromotional = this.Show.tickets.filter(obj => obj.is_promotional).length > 0;
                        }

                        this.Address = EventGetModel.GetEventLocation(this.Show);
                        this.SetDate();
                        this.GetImage();
                    },
                    (err) => {
                    }
                )
        }
    }


    SetDate()
    {
        this.isEnglish() != true?moment.locale('ru'):moment.locale('en');
        this.Date = "";
        const timeFormat = this.main.settings.GetTimeFormat() == TimeFormat.CIS ? 'HH:mm' : 'hh:mm A';
        const dateTimeFromat = "DD, YYYY " + timeFormat;
        
        if(this.Show.exact_date_from)
        {
            this.Show.exact_date_from = this.main.typeService.DateToUTCDateISOString(this.Show.exact_date_from);
            this.Date = this.ToUppercaseLetter(this.Show.exact_date_from, "MMM") 
                + moment(this.Show.exact_date_from).format(" DD, YYYY ")
                + "<span>" + moment(this.Show.exact_date_from).format(timeFormat) + "</span>";
        }
        else if(!this.Show.date_from && !this.Show.date_to)
        {
            this.Date = this.GetTranslateString(this.Show.event_season) + ' ' + this.Show.event_year;
            if(this.Show.event_time)
            {
                this.Date = this.Date + " - <span>"+this.GetTranslateString(this.Show.event_time)+"</span>"
            }
        }
        else if (this.Show.date_from && this.Show.date_to)
        {
            const dateFrom = this.ToUppercaseLetter(this.Show.date_from,'dddd')
                + this.ToUppercaseLetter(this.Show.date_from,'MMM')
                + moment(this.Show.date_from).format(dateTimeFromat)

            const dateTo = this.ToUppercaseLetter(this.Show.date_to,'dddd')
                 + this.ToUppercaseLetter(this.Show.date_to,'MMM')
                 + moment(this.Show.date_to).format(dateTimeFromat)

            let from = this.Show.date_from.split("T")[0];            
            let to = this.Show.date_to.split("T")[0];
            if(from === to){
                // let m = moment(this.Event.date_from);
                // this.Date = m.format(dateTimeFromat);
                this.Date = dateFrom;
                this.Date = this.Date + " - <span>"+ moment(this.Show.date_to).format(timeFormat)+"</span>";
                //this.Date = date.toLocaleDateString('EEEE, MMM d, yyyy HH:mm');
            }
            else{
                this.Date = dateFrom  + " - " + dateTo;
            }
        }
        
    }
    ToUppercaseLetter(date, format) : string{
        let formDate = moment(date).format(format);
        return formDate[0].toUpperCase() + formDate.substr(1) + ' ';
    }

    GetImage()
    {
        if(this.Show && this.Show.image_id)
        {
            
            this.Image = this.main.imagesService.GetImagePreview(this.Show.image_id,{width:500,height:500});
        }
    }

}