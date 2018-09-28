import { Component, OnInit, ViewChild, ElementRef } from "../../../../node_modules/@angular/core";
import { BaseComponent } from "../../core/base/base.component";
import { Params } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AccountGetModel } from '../../core/models/accountGet.model';
import { EventGetModel } from "../../core/models/eventGet.model";
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { GenreModel } from "../../core/models/genres.model";
import { SearchEventsMapComponent } from "../../shared/search/map/map.component";
import { CheckModel } from "../../core/models/check.model";
import { SelectModel } from "../../core/models/select.model";
import { BsDaterangepickerDirective, BsLocaleService, BsDaterangepickerConfig } from "../../../../node_modules/ngx-bootstrap";
import { Distance } from '../../core/models/preferences.model';
import { BsDatepickerDirective } from "ngx-bootstrap/datepicker";

declare var $:any;
declare var ionRangeSlider:any;

export enum SearchTypes{
    All = 'All',
    Fans = 'Fans',
    Artists = 'Artists',
    Venues = 'Venues',
    Shows = 'Shows'
};

@Component({
  selector: 'global-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class GlobalSearchComponent extends BaseComponent implements OnInit {
    SearchParams = {
        text: '',
        lat: null,
        lng: null,
        distance: null,
        units: null
    };
    Country: any = null;
    City: string = '';
    Lat:number = 0;
    Lng:number = 0;
    Distance: number = 0;
    TicketType = '';
    TypeOfSpace = '';
    LocalSearchTypes = SearchTypes;
    SearchType: string = SearchTypes.All;
    SelectedContent: string = SearchTypes.All;

    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;
    TicketTypes:CheckModel<any>[] = [];
    TypesOfSpace:SelectModel[] = [];
    MIN_DISTANCE:number = 10;
    MAX_DISTANCE:number = 300;
    SearchDateRange:Date[] = [];
    Units:string = Distance.Km;

    Countries: any[] = [];


    Fans: AccountGetModel[] = [];
    Artists: AccountGetModel[] = [];
    Venues: AccountGetModel[] = [];
    Shows: EventGetModel[] = [];
    private _picker: BsDatepickerDirective;
    LocationText:string = '';
    localeService: BsLocaleService;
    bsConfig: Partial<BsDaterangepickerConfig>;


    @ViewChild('SearchForm') form: NgForm;
    @ViewChild('mapForm') mapForm : SearchEventsMapComponent;
    @ViewChild('dp') datepicker: BsDaterangepickerDirective;
    
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(
            (params: Params) => {
                this.SearchParams.text = params["text"];
                this.ShowSearchResult();
            }
        );
        this.GetGenres();
        this.GetAllTypesOfSpace();
        this.GetTicketTypes();
        this.CreateLocalAutocomplete();
        this.InitBsConfig();
        this.initSlider();
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
            postfix: " " + this.main.settings.GetDisatance(),
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

    DistanceChanged(data:any)
    {
        this.SearchParams.distance = data.from;
    }

    InitBsConfig()
    {
        this.bsConfig = Object.assign({}, { 
            containerClass: 'theme-default transformedDatapicker',
            showWeekNumbers:false,
            rangeInputFormat: this.main.settings.GetDateFormat(),
            locale: this.settings.GetLang()
            
            
        });
    }
    onShowPicker(event) {
        const dayHoverHandler = event.dayHoverHandler;
        const hoverWrapper = (hoverEvent) => {
            const { cell, isHovered } = hoverEvent;
    
            if ((isHovered &&
              !!navigator.platform &&
              /iPad|iPhone|iPod/.test(navigator.platform)) &&
              'ontouchstart' in window
            ) {
                (this._picker as any)._datepickerRef.instance.daySelectHandler(cell);
            }
    
            return dayHoverHandler(hoverEvent);
        };
        event.dayHoverHandler = hoverWrapper;
    }
    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) =>{
                this.SearchParams.lat = place.geometry.location.lat();
                this.SearchParams.lng = place.geometry.location.lng();
                if(!this.Distance)
                    this.Distance = this.MIN_DISTANCE;
            }
        );
    }

    GetAllTypesOfSpace()
    {
        this.TypesOfSpace = this.main.typeService.GetAllSpaceTypes();
    }

    GetTicketTypes()
    {
        this.TicketTypes = this.main.typeService.GetTicketTypes();
    }

    ShowSearchResult()
    {
        if(this.SearchType == SearchTypes.All || this.SearchType == SearchTypes.Fans)
        {
            this.GetFans();
        }
        if(this.SearchType == SearchTypes.All || this.SearchType == SearchTypes.Artists)
        {
            this.GetArtists();
        }
        if(this.SearchType == SearchTypes.All || this.SearchType == SearchTypes.Venues)
        {
            this.GetVenues();
        }
        if(this.SearchType == SearchTypes.All || this.SearchType == SearchTypes.Shows)
        {
            this.GetShows();
        }
        this.SelectedContent = this.SearchType;
        
    }
    CloseXsSearchWindow(){
        if($(window).width()<=767){
            $('.flexed-search').removeClass('hidden-filter');
            $(window).scrollTop(0);
        }
    }
    OpenXsSearch(){
        if($(window).width()<=767){
            $('.flexed-search').addClass('hidden-filter');
            $(window).scrollTop(0);
        }
    }

    GetFans()
    {
        this.Fans = [];
        let search = Object.assign({},this.SearchParams);
        search = Object.assign(search,{
            type:"fan"
        });
        if(this.SearchType == SearchTypes.Fans)
        {
            search = Object.assign(search,{
                genres: this.main.genreService.GenreModelArrToStringArr(this.Genres)
            });
        }
        // console.log("fan",search);
        this.main.accService.AccountsSearch(search)
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Fans = res;
                }
            );
    }
    GetArtists()
    {
        this.Artists = [];
        let search = Object.assign({},this.SearchParams);
        search = Object.assign(search,{
            type:"artist"
        });
        if(this.SearchType == SearchTypes.Artists)
        {
            search = Object.assign(search,{
                genres: this.main.genreService.GenreModelArrToStringArr(this.Genres)
            });
        }
        // console.log("artist",search);
        this.main.accService.AccountsSearch(search)
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Artists = res;
                }
            );
    }
    GetVenues()
    {
        this.Venues = [];
        let search =  Object.assign({},this.SearchParams);
        search = Object.assign(search,{
            type:"venue"
        });
        // console.log("venue",search);
        this.main.accService.AccountsSearch(search)
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Venues = res;
                }
            );
    }
    GetShows()
    {
        this.Shows = [];
        let search:EventSearchParams = Object.assign({},this.SearchParams);
        search = Object.assign(search,{    
            is_active: true
        });

        if(this.SearchType == SearchTypes.Shows)
        {
            search = Object.assign(search,{
                genres: this.main.genreService.GenreModelArrToStringArr(this.Genres),
                ticket_types: this.TicketType ? [this.TicketType] : null,
                size: this.TypeOfSpace,
                from_date: this.SearchDateRange && this.SearchDateRange[0] ? this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]) : null,
                to_date: this.SearchDateRange && this.SearchDateRange[1] ? this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]) : null
            });
        }
        // console.log("shows",search);
        this.main.eventService.EventsSearch(search)
            .subscribe(
                (res: EventGetModel[]) => {
                    this.Shows = res;
                }
            );

    }

    GetGenres()
    {
        this.WaitBeforeLoading(
            () => this.main.genreService.GetAllGenres(),
            (res:string[]) => 
            {
                this.Genres = this.main.genreService.SetHiddenGenres(this.main.genreService.StringArrayToGanreModelArray(res));
            }
        );
    }

    ChangeView(Page:string)
    {
        this.SelectedContent = Page;
    }

    OpenMap()
    {
        this.mapForm.AboutOpenMapModal(this.SearchParams);
    }

    LocationTextChenged($event)
    {
        this.LocationText = $event;
        this.CheckDistance();
    }

    CheckDistance()
    {
        
        if(!this.LocationText)
        {
            this.SearchParams.lat = null;
            this.SearchParams.lng = null;
        }

        if(!this.SearchParams.lat && this.SearchParams.lng)
            this.SearchParams.distance = null;
        else{
            this.SearchParams.distance = this.SearchParams.distance?this.SearchParams.distance:this.MIN_DISTANCE;
            this.SearchParams.units = this.main.settings.GetDisatance();
        }
            
    }

    OnMapClicked($event)
    {
        if($event.lat)
        {
            this.SearchParams.lat = $event.lat;
        }
        if($event.lng)
        {
            this.SearchParams.lng = $event.lng;
        }
        if($event.text)
        {
            this.LocationText = $event.text;
        }
    }

}

export interface CountryCodes{
    name: string;
    code: string;
}