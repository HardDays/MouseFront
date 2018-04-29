import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm,FormControl} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CheckModel } from '../../core/models/check.model';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { MainService } from '../../core/services/main.service';
import { SearchEventComponent } from './search/search.component';
import { MapEventComponent } from './map/map.component';

declare var $:any;

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})


export class EventsComponent extends BaseComponent implements OnInit {
    
    Events:EventGetModel[] = [];

    ngOnInit()
    {   
        this.GetEvents();
        this.openSearch();
        this.setHeightSearch();
    }
    @ViewChild('search') search: SearchEventComponent;
    
    @ViewChild('mapForm') mapForm : MapEventComponent;

    GetEvents(params?:EventSearchParams)
    {
        let search:EventSearchParams = {
            limit: 21,
            only_my: true,
            account_id : this.GetCurrentAccId()
        };

        if(params)
            search = params;
        this.WaitBeforeLoading(
            () => this.main.eventService.EventsSearch(search),
            (res:EventGetModel[]) =>
            {
                this.Events = res;
                // this.CloseSearchWindow();
            },
            (err) => {
                console.log(err);
            }
        );
    }
    
    setHeightSearch()
    {
        if($('.main-router-outlet .main-router-outlet').height() < $(window).height()){
          $('.wrapp-for-filter').css({
             "height": $('.for-flex-height').height()-150
          });
        }
      else{
         $('.wrapp-for-filter').css({
             "height": '100%'
          }); 
      }
    }

    

    analiticsClick()
    {
        $('#modal-analytics').modal('show');
    }

    
    openSearch()
    {
        let _that = this;
        $(".nav-button").on("click", function (e) {
            _that.setHeightSearch();
            e.preventDefault();
            $("body").addClass("has-active-menu");
            $(".mainWrapper").addClass("has-push-left");
            $(".nav-holder-3").addClass("is-active");
            $(".mask-nav-3").addClass("is-active")
        });
        $(".menu-close, .mask-nav-3").on("click", function (e) {
            e.preventDefault();
            $("body").removeClass("has-active-menu");
            $(".mainWrapper").removeClass("has-push-left");
            $(".nav-holder-3").removeClass("is-active");
            $(".mask-nav-3").removeClass("is-active")
        });
    }

    OpenMap(params)
    {
        this.mapForm.AboutOpenMapModal(params);
    }

    TransferMapToSearch(params)
    {
        this.search.GetLocation(params);
    }

    
}
