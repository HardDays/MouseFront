import { Component, OnInit, ViewChild } from "../../../../node_modules/@angular/core";
import { BaseComponent } from "../../core/base/base.component";
import { Params } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AccountGetModel } from '../../core/models/accountGet.model';
import { EventGetModel } from "../../core/models/eventGet.model";
import { EventSearchParams } from '../../core/models/eventSearchParams';
import { GenreModel } from "../../core/models/genres.model";

declare var $:any;
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
        limit: null
    };
    LocalSearchTypes = SearchTypes;
    SearchType: string = SearchTypes.All;
    SelectedContent: string = SearchTypes.All;

    Genres:GenreModel[] = [];
    ShowMoreGenres:boolean = false;


    Fans: AccountGetModel[] = [];
    Artists: AccountGetModel[] = [];
    Venues: AccountGetModel[] = [];
    Shows: EventGetModel[] = [];


    @ViewChild('SearchForm') form: NgForm;
    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(
            (params: Params) => {
                this.SearchParams.text = params["text"];
                this.ShowSearchResult();
            }
        );
        this.GetGenres();
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
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres)
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
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres)
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
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{type:"venue"}))
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
            genres: this.main.genreService.GenreModelArrToStringArr(this.Genres)
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

}