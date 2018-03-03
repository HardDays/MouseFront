import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import { GengreModel } from '../models/genres.model';
import { TypeService } from "./type.service";


@Injectable()
export class GenresService{

    genres:GengreModel[] = [];
    
    constructor(private http: HttpService, private router: Router, private types:TypeService){
        // this.genres = this.GetAll();
    }

    GetArtists(genres:GengreModel[]){
        
        let params = {
            genres:this.GenreModelArrToStringArr(genres)
        };
        // for(let g of genres) 
        //     if(g.checked) params+="genres[]="+g.genre+"&";
    
            return this.http.CommonRequestWithBody(
                ()=> this.http.GetData('/genres/artists.json/',this.types.ParamsToUrlSearchParams(params))
            );
        // return this.http.GetData('/genres/artists.json/',params);
    }

    GetAllGenres(){
        return this.http.CommonRequestWithBody(
            ()=> this.http.GetData('/genres/all.json',"")
        );
        // return this.http.GetData('/genres/all.json',"");
    }

    GetAllGM(){
        this.genres = [];
        this.GetAllGenres().subscribe((res)=>{
            console.log("PAR", res);
            for(let g of res){
                let genre:string = g;
                let checked = false,show = false;
                let genre_show:string = this.convertToShow(genre);
                this.genres.push({genre,genre_show,checked,show})
            }
            this.genres[0].show=true;this.genres[1].show=true;
            this.genres[2].show=true;this.genres[3].show=true;
        });
       return this.genres;
    }

    StringArrayToGanreModelArray(input: string[]):GengreModel[]
    {
        let result:GengreModel[] = [];
        for(let i in input)
        {
            result.push(new GengreModel(input[i],this.convertToShow(input[i]),false,+i<4));
        }
        return result;
    }

    GetAll(check?:GengreModel[]){
        this.genres = [];
        this.GetAllGenres().subscribe((res)=>{
            for(let g of res){
                let genre:string = g;
                let checked = false;
                if(check)for(let x of check) if (x.genre == genre)
                    checked = x.checked;
                let genre_show:string = this.convertToShow(genre);
                this.genres.push({genre,genre_show,checked})
            }
        });
       return this.genres;
    }
    
    GetMin(){
        return [
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
    }
    
    public GetGendreModelFromString(newGenres:string[], allGenres:GengreModel[]):GengreModel[]{
        let result:GengreModel[] = allGenres;
        console.log("Input", allGenres);
        for(let i of newGenres)
        {
            for(let j of result) {
                if(i == j.genre)
                    j.checked = true;
                    j.show = true;
            }
        }
        console.log("Output", result);
        return result;
    }

    convertToShow(genre:string):string{
        let genre_show = '';
        genre_show = genre.replace('_',' ').toUpperCase();
        return genre_show;
    }

    GenreModelArrToStringArr(genres:GengreModel[])
    {
        let result = [];
        for(let i of genres)
        {
            if(i.checked)
                result.push(i.genre);
        }

        return result;
    }


}