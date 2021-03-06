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
    Date:string = null;
    DisplayName: string = "";
    DisplayCity: string = "";

    
    ngOnInit(): void {
        this.GetExtendedShowModel();
        this.GetImage();
        if(this.Show.date_from)
        {
            if(this.Show.exact_date_from)
            {
                this.Date = this.main.typeService.DateToUTCDateISOString(this.Show.exact_date_from);
                this.Time = this.main.accService.GetTimeFromString(this.Show.exact_date_from);
            }
            else if(this.Show.date_from)
            {
                this.Date = this.main.typeService.DateToUTCDateISOString(this.Show.date_from);
                this.Time = this.main.accService.GetTimeFromString(this.Show.date_from);
            }
            
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
        //test
        if(this.Show.id)
        {
            this.main.eventService.GetEventById(this.Show.id)
                .subscribe(
                    (res: EventGetModel) => {
                        this.DisplayName = (res.venue)?res.venue.display_name : "";
                        this.DisplayCity = (res.venue)?res.venue.city : "";
                    }
                );
        }
    }

    Navigate()
    {
        this.router.navigate(['/system','shows_detail',this.Show.id])
    }
  }