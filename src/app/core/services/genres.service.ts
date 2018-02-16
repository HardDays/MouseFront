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
        
        let params:string = '';
        for(let g of genres) 
            if(g.checked) params+="genres[]="+g.genre+"&";
    
        console.log('genres',params,JSON.stringify(params));
        return this.http.GetData('/genres/artists.json/',params);
    }

    GetAllGenres(){
        return this.http.GetData('/genres/all.json',"");
    }

    GetAll(check:GengreModel[]){
        this.genres = [];
        this.GetAllGenres().subscribe((res)=>{
            for(let g of res){
                let genre:string = g;
                let checked = false;
                for(let x of check) if (x.genre == genre)
                    checked = x.checked;
                let genre_show:string = this.convertToShow(genre);
                this.genres.push({genre,genre_show,checked})
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
                genre:'pop',
                genre_show:'POP',
                checked:false
            },
            {
                genre:'blues',
                genre_show:'BLUES',
                checked:false
            },
            {
                genre:'jazz',
                genre_show:'JAZZ',
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