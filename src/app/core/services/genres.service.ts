import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import { GengreModel } from "../models/genres.model";


@Injectable()
export class GenresService{

    genres:GengreModel[] = [];
    constructor(private http: HttpService, private router: Router){
       
    }

    GetAllGenres(){
        return this.http.GetData('/genres/all.json',"");
    }

    GetAll(){
        this.genres = [];
        this.GetAllGenres().subscribe((res)=>{
            for(let g of res){
                let genre:string = g;
                let genre_show:string = this.convertToShow(genre);
                this.genres.push({genre,genre_show})
            }
        });
       return this.genres;
    }
    GetMin(){
        this.genres = [
            {
                genre:'hip_hop',
                genre_show:'HIP HOP'
            },
            {
                genre:'rnb',
                genre_show:'RNB'
            },
            {
                genre:'blues',
                genre_show:'BLUES'
            }
        ];
        return this.genres;
    }
    convertToShow(genre:string):string{
        let genre_show = '';
        genre_show = genre.replace('_',' ').toUpperCase();
        // for(let g of gnrs) genre_show+=g.charAt(0).toUpperCase() + g.substr(1).toLowerCase()+" ";
        return genre_show;
    }


}