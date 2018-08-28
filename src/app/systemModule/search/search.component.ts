import { Component, OnInit, ViewChild } from "../../../../node_modules/@angular/core";
import { BaseComponent } from "../../core/base/base.component";
import { Params } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AccountGetModel } from '../../core/models/accountGet.model';
import { EventGetModel } from "../../core/models/eventGet.model";

declare var $:any;
export enum SearchTypes{
    All = 'all',
    Fans = 'fans',
    Artists = 'artists',
    Venues = 'venues',
    Shows = 'shows'
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
    }
    ShowSearchResult()
    {
        if(this.SearchType == SearchTypes.All)
        {
            this.GetFans();
            this.GetArtists();
            this.GetVenues();
            this.GetShows();
        }
        //this.router.navigateByUrl("/system/search", {queryParams: this.SearchParams});
    }

    GetFans()
    {
        this.Fans = [];
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{type:"fan"}))
            .subscribe(
                (res: AccountGetModel[]) => {
                    this.Fans = res;
                }
            );
    }
    GetArtists()
    {
        this.Artists = [];
        this.main.accService.AccountsSearch(Object.assign(this.SearchParams,{type:"artist"}))
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

    }

}