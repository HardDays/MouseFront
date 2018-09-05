import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { EventGetModel } from "../../../../core/models/eventGet.model";
import { BaseImages } from "../../../../core/base/base.enum";

@Component({
    selector: 'one-show-search-component',
    templateUrl: './one-show.component.html',
    styleUrls: ['./../../search.component.css']
  })
  
  export class OneShowSearchComponent extends BaseComponent implements OnInit {   
    
    @Input() Show: EventGetModel;

    Image:string = BaseImages.Drake;
    Time:string = "00:00";
    DisplayName: string = "";
    DisplayCity: string = "";

    
    ngOnInit(): void {
        this.GetExtendedShowModel();
        this.GetImage();
        if(this.Show.date_from)
        {
            this.Time = this.main.accService.GetTimeFromString(this.Show.date_from);
        }
    }

    GetImage()
    {
        if(this.Show.image_id){
            this.Image = this.main.imagesService.GetImagePreview(this.Show.image_id,{width:230, height: 230});
        }
    }

    GetExtendedShowModel()
    {
        if(this.Show.id)
        {
            this.main.eventService.GetEventById(this.Show.id)
                .subscribe(
                    (res: EventGetModel) => {
                        this.DisplayName = res.venue.display_name;
                        this.DisplayCity = res.venue.city;
                    }
                );
        }
    }

    Navigate()
    {
        this.router.navigate(['/system','shows_detail',this.Show.id])
    }
  }