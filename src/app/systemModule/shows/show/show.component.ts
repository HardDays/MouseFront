import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';


@Component({
    selector: 'shows-item-selector',
    templateUrl: './show.component.html',
    styleUrls: [ './../shows.component.css']
})
export class ShowItemComponent extends BaseComponent implements OnInit {
    @Input() Show: EventGetModel;
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;
    IsPromotional = false;

    ngOnInit(): void 
    {
        this.GetExtendedEvent();
    }

    GetExtendedEvent()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.GetEventById(this.Show.id),
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
        );
    }

    GetImage()
    {
        if(this.Show && this.Show.image_id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.Show.image_id),
                (res:Base64ImageModel) => {
                    this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
                }
            );
        }
    }
}