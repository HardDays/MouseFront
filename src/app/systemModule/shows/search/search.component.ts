import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventSearchParams } from '../../../core/models/eventSearchParams';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'search-shows-selector',
    templateUrl: './search.component.html',
    styleUrls: ['./../shows.component.css']
})
export class SearchShowsComponent extends BaseComponent implements OnInit {
    @Output() onSearch:EventEmitter<EventSearchParams> = new EventEmitter<EventSearchParams>();
    @Output() mapClicked:EventEmitter<EventSearchParams> = new EventEmitter<EventSearchParams>();
    SearchParams: EventSearchParams = new EventSearchParams();

    
    mapLng: any;
    mapLat: any;
    mapCoords = {lat:0, lng:0};
    MapPosition = {
        lat:0,
        lng:0
    };

    MIN_DISTANCE:number = 0;
    MAX_DISTANCE:number = 40;

    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;

    TicketTypes:CheckModel<any>[] = [];
    TypesOfSpace:SelectModel[] = [];

    SearchDateRange:Date[] = [];

    LocationText:string = '';
    bsConfig: Partial<BsDatepickerConfig>;
    @ViewChild('SearchForm') form: NgForm;
    
    ngOnInit(): void 
    {
        this.SearchParams.limit = 15;
        // this.SearchParams.only_my = true;
        // this.SearchParams.account_id = this.GetCurrentAccId();
        
        this.GetGenres();
        this.GetTicketTypes();
        this.GetAllTypesOfSpace();
        
        this.CreateLocalAutocomplete();
        this.InitBsConfig();
        this.initSlider();
    }

    DistanceChanged(data:any)
    {
      this.SearchParams.distance = data.from;
    }

    initSlider()
    {
        let _that = this;

        var distance_slider = $(".distance-slider").ionRangeSlider({
            type:"single",
            min: this.MIN_DISTANCE,
            max: this.MAX_DISTANCE,
            from: this.MIN_DISTANCE,
            hide_min_max: false,
            postfix: " km",
            grid: false,
            prettify_enabled: true,
            prettify_separator: ',',
            grid_num: 5,
            onChange: function(data)
            {
              _that.DistanceChanged(data);
            }
        });
    }

    CloseSearchWindow()
    {
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
    }


    GetAllTypesOfSpace()
    {
        this.TypesOfSpace = this.main.typeService.GetAllSpaceTypes();
    }

    GetTicketTypes()
    {
        this.TicketTypes = this.main.typeService.GetTicketTypes();
    }

    GetGenres()
    {
        this.WaitBeforeLoading(
            () => this.main.genreService.GetAllGenres(),
            (res:string[]) => {
                this.Genres = this.main.genreService.SetHiddenGenres(this.main.genreService.StringArrayToGanreModelArray(res));
            }
        );
    }

    

    InitBsConfig()
    {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
    }

    

    PriceChanged(data)
    {}
    
    CheckDistance()
    {
        
        if(!this.LocationText)
        {
            this.SearchParams.lat = null;
            this.SearchParams.lng = null;
        }

        if(!this.SearchParams.lat || !this.SearchParams.lng)
            this.SearchParams.distance = null;
    }

    ConvertTicketTypes()
    {
        this.SearchParams.ticket_types = this.main.typeService.TicketTypesArrayToStringArray(this.TicketTypes);
    }

    ConvertGenreCheckboxes()
    {
        this.SearchParams.genres = this.main.genreService.GenreModelArrToStringArr(this.Genres);
    }

    ConvertSearchDateRangeToSearchParams()
    {
        if(this.SearchDateRange && this.SearchDateRange.length == 2)
        {
            this.SearchParams.from_date = this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]);
            this.SearchParams.to_date = this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]);
        }
        else
        {
            this.SearchParams.from_date = "";
            this.SearchParams.to_date = "";
        }
    }

    TypeOfSpaceChange($event)
    {
        this.SearchParams.size = [];
        if($event)
            this.SearchParams.size.push($event);
    }

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) =>{
                this.SearchParams.lat = place.geometry.location.lat();
                this.SearchParams.lng = place.geometry.location.lng();
            }
        );
    }

    ShowSearchResult()
    {
        this.ConvertSearchDateRangeToSearchParams();
        this.ConvertGenreCheckboxes();
        this.ConvertTicketTypes();
        this.CheckDistance();

        this.CloseSearchWindow();
        this.onSearch.emit(this.SearchParams);
    }


    GetLocation(event:any)
    {
        if(event)
        {
            if(event.lat)
                this.SearchParams.lat = event.lat;
            if(event.lng)
                this.SearchParams.lng = event.lng;
            if(event.text)
                this.LocationText = event.text;
        }
    }

    OpenMap()
    {
        this.mapClicked.emit(this.SearchParams);
    }

    LocationTextChenged($event)
    {
        this.LocationText = $event;
        this.CheckDistance();
    }
    
}