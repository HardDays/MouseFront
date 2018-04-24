import { Component, ViewChild } from '@angular/core';
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

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})


export class EventsComponent extends BaseComponent implements OnInit {
    Events:EventGetModel[] = [];

    SearchParams: EventSearchParams = new EventSearchParams();
    
    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;

    TicketTypes:CheckModel<any>[] = [];
    TypesOfSpace:SelectModel[] = [];
    @ViewChild('SearchForm') form: NgForm;

    SearchDateRange:Date[] = [];

    bsConfig: Partial<BsDatepickerConfig>;
    ngOnInit()
    {   
        this.InitSearchParams();
        this.GetGenres();
        this.GetTicketTypes();
        this.GetAllTypesOfSpace();

        this.GetEvents();
        this.openSearch();
        this.initSlider();
        this.setHeightSearch();
        this.InitBsConfig();
    }

    GetAllTypesOfSpace()
    {
        this.TypesOfSpace = this.typeService.GetAllSpaceTypes();
    }

    GetTicketTypes()
    {
        this.TicketTypes = this.typeService.GetTicketTypes();
    }

    GetGenres()
    {
        this.WaitBeforeLoading(
            () => this.genreService.GetAllGenres(),
            (res:string[]) => {
                this.Genres = this.genreService.SetHiddenGenres(this.genreService.StringArrayToGanreModelArray(res));
            }
        );
    }

    InitSearchParams()
    {
        this.SearchParams.only_my = true;
        this.SearchParams.account_id = +localStorage.getItem('activeUserId');
    }

    InitBsConfig()
    {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
    }

    setHeightSearch(){
        //console.log($('.main-router-outlet .main-router-outlet').height(),$(window).height());
        if($('.main-router-outlet .main-router-outlet').height() < $(window).height()){
          $('.wrapp-for-filter').css({
             "height": $('.for-flex-height').height()-150
          });
          //console.log(`one`);
        }
      else{
         $('.wrapp-for-filter').css({
             "height": '100%'
          }); 
          //console.log(`two`);
      }
      }

    initSlider(){
        let _the = this;
        var price_slider = $(".current-slider").ionRangeSlider({
            type:"double",
            min: 10,
            max: 10000,
            from: 0,
            hide_min_max: false,
            prefix: " ",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function(data)
            {
              _the.PriceChanged(data);
            }
        });
    }

    PriceChanged(data:any)
    {
    //   if(data.from && this.SearchParams.price_from != data.from)
    //     this.SearchParams.price_from = data.from;
    //   if(data.to && this.SearchParams.price_to != data.to)  
    //     this.SearchParams.price_to = data.to;
        //console.log(`data`,data);
    }

    GetEvents()
    {
        this.WaitBeforeLoading(
            () => this.eventService.EventsSearch(this.SearchParams),
            (res:EventGetModel[]) =>
            {
                this.Events = res;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    ShowSearchResults()
    {
        //console.log(this.SearchDateRange);
        this.ConvertSearchDateRangeToSearchParams();
        this.ConvertGenreCheckboxes();
        this.ConvertTicketTypes();

        // console.log(this.SearchParams);
        this.GetEvents();
    }

    ConvertTicketTypes()
    {
        this.SearchParams.ticket_types = this.typeService.TicketTypesArrayToStringArray(this.TicketTypes);
    }

    ConvertGenreCheckboxes()
    {
        this.SearchParams.genres = this.genreService.GenreModelArrToStringArr(this.Genres);
    }

    ConvertSearchDateRangeToSearchParams()
    {
        if(this.SearchDateRange && this.SearchDateRange.length == 2)
        {
            this.SearchParams.from_date = this.typeService.GetDateStringFormat(this.SearchDateRange[0]);
            this.SearchParams.to_date = this.typeService.GetDateStringFormat(this.SearchDateRange[1]);
        }
        else{
            this.SearchParams.from_date = "";
            this.SearchParams.to_date = "";
        }
    }

    analiticsClick(){
        $('#modal-analytics').modal('show');
    }

    openSearch(){
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
    TypeOfSpaceChange($event)
    {
        this.SearchParams.size = [];
        if($event)
            this.SearchParams.size.push($event);
    }

    

}
