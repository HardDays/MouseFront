import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import { GengreModel } from "../models/genres.model";


@Injectable()
export class GenresService{

    genres:GengreModel[] = [];
    
    constructor(private http: HttpService, private router: Router){}

    GetArtists(genres:GengreModel[]){
        
        let genr:string[] = [];
        for(let g of genres) 
            if(g.checked) genr.push(g.genre);
        
        let params = {
            genres:genr
        };

        console.log('genres',params);
        return this.http.GetData('/genres/artists.json',JSON.stringify(params));
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
                this.genres.push({genre,genre_show,})
            }
        });
       return this.genres;
    }
    GetMin(){
        this.genres = [
            {
                genre:'hip_hop',
                genre_show:'HIP HOP',
                checked:false
            },
            {
                genre:'rnb',
                genre_show:'RNB',
                checked:false
            },
            {
                genre:'blues',
                genre_show:'BLUES',
                checked:false
            }
        ];
        return this.genres;
    }
    
    convertToShow(genre:string):string{
        let genre_show = '';
        genre_show = genre.replace('_',' ').toUpperCase();
        return genre_show;
    }


}