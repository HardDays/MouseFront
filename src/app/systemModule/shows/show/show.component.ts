import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';


@Component({
    selector: 'shows-item-selector',
    templateUrl: './show.component.html',
    styleUrls: [ './../shows.component.css']
})
export class ShowItemComponent extends BaseComponent implements OnChanges {
    
    @Input() Show: EventGetModel;
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;
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
                        if(this.Show.is_crowdfunding_event)
                        {
                            this.FoundedPercent = +(100*(this.Show.founded?this.Show.founded:0) / (this.Show.funding_goal?this.Show.funding_goal:0.01)).toFixed(1);
                            
                        }

                        if(this.Show.tickets && this.Show.tickets.length > 0)
                        {
                            this.IsPromotional = this.Show.tickets.filter(obj => obj.is_promotional).length > 0;
                        }
                        this.GetImage();
                    },
                    (err) => {
                    }
                )
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