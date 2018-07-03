import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import * as moment from 'moment';


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

    ngOnChanges(changes: SimpleChanges): void 
    {
        this.GetExtendedEvent();
    }

    GetExtendedEvent()
    {
        if(this.Show && this.Show.id)
        {
            this.main.eventService.GetEventById(this.Show.id)
                .subscribe(
                    (res:any) =>{
                        this.Show = res;
                        console.log(this.Show);
                        if(this.Show.is_crowdfunding_event)
                        {
                            this.FoundedPercent = +(100*(this.Show.founded?this.Show.founded:0) / (this.Show.funding_goal?this.Show.funding_goal:0.01)).toFixed(1);
                            
                        }

                        if(this.Show.tickets && this.Show.tickets.length > 0)
                        {
                            this.IsPromotional = this.Show.tickets.filter(obj => obj.is_promotional).length > 0;
                        }
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
        this.Date = "";
        if(!this.Show.date_from && !this.Show.date_to)
        {
            this.Date = this.Show.event_season + ", " + this.Show.event_year;
            if(this.Show.event_time)
            {
                this.Date = this.Date + " - <span>"+this.Show.event_time+"</span>"
            }
        }
        else if (this.Show.date_from && this.Show.date_to)
        {
            let from = this.Show.date_from.split("T")[0];
            let to = this.Show.date_to.split("T")[0];
            if(from === to){
                let m = moment(this.Show.date_from);
                this.Date = m.format('dddd, MMM DD, YYYY HH:mm');
                this.Date = this.Date + " - <span>"+ moment(this.Show.date_to).format('HH:mm')+"</span>";
                //this.Date = date.toLocaleDateString('EEEE, MMM d, yyyy HH:mm');
            }
            else{
                this.Date = moment(this.Show.date_from).format('dddd, MMM DD, YYYY HH:mm') + " - " + moment(this.Show.date_to).format('dddd, MMM DD, YYYY HH:mm');
            }
        }
    }

    GetImage()
    {
        if(this.Show && this.Show.image_id)
        {
            this.Image = this.main.imagesService.GetImagePreview(this.Show.image_id,{width:500,height:500});
        }
    }

}