import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BaseComponent } from '../../../core/base/base.component';
import { EventSearchParams } from '../../../core/models/eventSearchParams';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { TicketsSearchParams } from '../../../core/models/ticketsSearchParams.model';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
defineLocale('ru', ruLocale);

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'search-tickets-window-cmp',
    templateUrl: './search.component.html',
    styleUrls: ['./../tickets.component.css']
})
export class SearchTicketsComponent extends BaseComponent implements OnInit {
    @Input() SearchParams: TicketsSearchParams;
    @Output() onSearch:EventEmitter<TicketsSearchParams> = new EventEmitter<TicketsSearchParams>();
    @Output() mapClicked:EventEmitter<any> = new EventEmitter<any>();
    
    mapLng: any;
    mapLat: any;
    mapCoords = {lat:0, lng:0};
    MapPosition = {
        lat:0,
        lng:0
    };

    MIN_DISTANCE:number = 10;
    MAX_DISTANCE:number = 40;

    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;

    TicketTypes:CheckModel<any>[] = [];
    TypesOfSpace:SelectModel[] = [];

    SearchDateRange:Date[] = [];


    bsConfig: Partial<BsDatepickerConfig>;
    @ViewChild('SearchForm') form: NgForm;
    
    ngOnInit(): void 
    {
        //this.SearchParams.limit = 15;
        
        // this.SearchParams.only_my = true;
        // this.SearchParams.account_id = this.GetCurrentAccId();
        
        this.GetGenres();
        this.GetTicketTypes();
        this.GetAllTypesOfSpace();
        
        this.CreateLocalAutocomplete();
        this.InitBsConfig();
      
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
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default transformedDatapicker',showWeekNumbers:false, locale: this.settings.GetLang() });
    }

    

    PriceChanged(data)
    {}
    

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
            this.SearchParams.date_from = this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]);
            this.SearchParams.date_to = this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]);
        }
        else
        {
            this.SearchParams.date_from  = "";
            this.SearchParams.date_to = "";
        }
    }

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) =>{
                this.SearchParams.location = place.formatted_address;
                this.mapCoords.lat = place.geometry.location.lat();
                this.mapCoords.lng = place.geometry.location.lng();
            }
        );
    }

    ShowSearchResult()
    {
        this.ConvertSearchDateRangeToSearchParams();
        this.ConvertGenreCheckboxes();
        this.ConvertTicketTypes();

        this.CloseSearchWindow();
        this.SearchParams.offset = 0;
        this.onSearch.emit(this.SearchParams);
    }


    GetLocation(event:any)
    {
        if(event)
        {
            if(event.text){
                this.SearchParams.location = event.text;
            }
            if(event.lat){
                this.mapCoords.lat = event.lat;
            }
            if(event.lng){
                this.mapCoords.lng = event.lng;
            }
        }
    }

    OpenMap()
    {
        this.mapClicked.emit(this.mapCoords);
    }

    LocationTextChenged($event)
    {
        this.SearchParams.location = $event;
        if(!this.SearchParams.location){
            this.mapCoords.lat = null;
            this.mapCoords.lng = null;
        }
    }
    
}