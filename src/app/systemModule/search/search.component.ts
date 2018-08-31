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
        text: ''
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
        this.CreateCityAutocomplete();
        this.GetCountries();
    }

    GetCountries()
    {
        this.main.phoneService.GetCountryCodes()
            .subscribe(
                (res: CountryCodes[]) => {
                    this.Countries = res;
                }
            );
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
        this.Distance = data.from;
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

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) =>{
                this.Lat = place.geometry.location.lat();
                this.Lng = place.geometry.location.lng();
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
        //this.router.navigateByUrl("/system/search", {queryParams: this.SearchParams});
    }

    GetFans()
    {
        this.Fans = [];
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{
            type:"fan",
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres),
            city: this.City,
            country: this.Country && this.Country.name ? this.Country.name : null
        }))
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Fans = res;
                }
            );
    }
    GetArtists()
    {
        this.Artists = [];
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{
            type:"artist",
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres),
            city: this.City,
            country: this.Country && this.Country.name ? this.Country.name : null
        }))
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Artists = res;
                }
            );
    }
    GetVenues()
    {
        this.Venues = [];
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{
            type:"venue",
            city: this.City,
            country: this.Country && this.Country.name ? this.Country.name : null
        }))
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Venues = res;
                }
            );
    }
    GetShows()
    {
        this.Shows = [];
        let search:EventSearchParams = this.SearchParams;
        search.is_active = true; 
        this.main.eventService.EventsSearch(Object.assign(search,{
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres),
            is_active: true,
            ticket_types: this.TicketType ? [this.TicketType] : null,
            size: this.TypeOfSpace,
            from_date: this.SearchDateRange && this.SearchDateRange[0] ? this.main.typeService.GetDateStringFormat(this.SearchDateRange[0]) : null,
            to_date: this.SearchDateRange && this.SearchDateRange[1] ? this.main.typeService.GetDateStringFormat(this.SearchDateRange[1]) : null,
            lat: this.Lat? this.Lat : null,
            lng: this.Lng? this.Lng : null,
            distance: (this.Lat && this.Lng)? this.Distance : null,
            units: (this.Lat && this.Lng)? this.Units : null,
        }))
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
        this.mapForm.AboutOpenMapModal({lat: this.Lat, lng: this.Lng});
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
            this.Lat = null;
            this.Lng = null;
        }

        if(!this.Lat && this.Lng)
            this.Distance = null;
        else{
            this.Distance = this.Distance?this.Distance:this.MIN_DISTANCE;
            this.Units = this.main.settings.GetDisatance();
        }
            
    }

    OnMapClicked($event)
    {
        if($event.lat)
        {
            this.Lat = $event.lat;
        }
        if($event.lng)
        {
            this.Lng = $event.lng;
        }
        if($event.text)
        {
            this.LocationText = $event.text;
        }
    }
    Autocomplete:google.maps.places.Autocomplete = null;
    @ViewChild('seaarchCity') public seaarchCity: ElementRef;
    CreateCityAutocomplete()
    {
        if(!this.Autocomplete)
        {
            this.mapsAPILoader.load().then(
                () => {
                    let options = {
                        type: '(cities)'
                    };
                    this.Autocomplete = new google.maps.places.Autocomplete(this.seaarchCity.nativeElement,options);
                    
                    this.Autocomplete.addListener(
                        "place_changed",
                        () => {
                            console.log(`place_changed`);
                            this.ngZone.run(
                                () => {
                                    let place: google.maps.places.PlaceResult = this.Autocomplete.getPlace();
                                    if(place.name)
                                    {
                                        this.City = place.name;
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
        else{
            if(this.Country && this.Country.code)
            {
                this.Autocomplete.setComponentRestrictions({
                    country: this.Country.code
                });
            }
            else{
                this.Autocomplete.setComponentRestrictions(null);
            }
        }
        
    }

    AutocompleteListFormatter = (data: CountryCodes) => {
        return data.name;
    }

    CountryChanged($event)
    {
        if($event && $event.name && $event.code)
        {
            this.Country = $event;
        }
        else{
            this.Country = null;
        }
        
        this.CreateCityAutocomplete();
    }
}

export interface CountryCodes{
    name: string;
    code: string;
}