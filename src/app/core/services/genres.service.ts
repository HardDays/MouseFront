import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import { GenreModel } from '../models/genres.model';
import { TypeService } from "./type.service";


@Injectable()
export class GenresService{

    genres:GenreModel[] = [];
    
    constructor(private http: HttpService, private router: Router, private types:TypeService){
        // this.genres = this.GetAll();
    }

    GetArtists(genres:GenreModel[]){
        
        let params = {
            genres:this.GenreModelArrToStringArr(genres)
        };
        return this.http.CommonRequest(
            ()=> this.http.GetData('/genres/artists.json/',this.types.ParamsToUrlSearchParams(params))
        );
    }

    GetAllGenres(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/genres/all.json',"")
        );
    }

    StringArrayToGanreModelArray(input: string[]):GenreModel[]
    {
        let result:GenreModel[] = [];
        for(let i in input)
        {
            result.push(new GenreModel(input[i],this.convertToShow(input[i]),false,+i<4));
        }
        return result;
    }

    StringArrayToGenreModelArray(input: string[]):GenreModel[]
    {
        let result:GenreModel[] = [];
        for(let i in input)
        {
            result.push(new GenreModel(i,input[i],false,+i<4));
        }
        return result;
    }


    GetAll(check?:GenreModel[]){
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
                genre:'children_music',
                genre_show:'HIP HOP',
                checked:false
            },
            {
                genre:'classical',
                genre_show:'POP',
                checked:false
            },
            {
                genre:'blues',
                genre_show:'BLUES',
                checked:false
            },
            {
                genre:'country',
                genre_show:'JAZZ',
                checked:false
            }
        ];
    }
    
    public GetGendreModelFromString(newGenres:string[], allGenres:GenreModel[]):GenreModel[]{
        let result:GenreModel[] = allGenres;
        if(newGenres) {
            for(let i of newGenres)
            {
                for(let j of result) {
                    if(i == j.genre)
                        j.checked = true;
                        j.show = true;
                }
            }
        }
        return result;
    }

    public SetHiddenGenres(genres:GenreModel[])
    {
        for(let i in genres)
        {
            genres[i].show = +i < 4;
        }
        return genres;
    }

    convertToShow(genre:string):string{
        let genre_show = '';
        genre_show = genre.replace('_',' ').toUpperCase();
        
        if ( genre_show.indexOf('/') > -1 ) 
        {
            genre_show = genre_show.replace("/", " / ");          
        }
        return genre_show;
    }

    GenreModelArrToStringArr(genres:GenreModel[])
    {
        const newGenres = {
            blues: "blues",
            children_music: "children music",
            classical: "classical",
            country: "country",
            electronic: "electronic",
            holiday: "holiday",
            opera: "opera",
            singer: "singer/songwriter",
            jazz: "jazz",
            latino: "latino",
            new_age: "new age",
            pop: "pop",
            soul: "r&b/soul",
            musicals: "musicals",
            dance: "dance",
            hip_hop: "hip-hop/rap",
            world: "world",
            alternative: "alternative",
            rock: "rock",
            christian_gospel: "christian & gospel",
            vocal: "vocal",
            reggae: "reggae",
            easy_listening: "easy listening",
            j_pop: "j-pop",
            enka: "enka",
            anime: "anime",
            kayokyoku: "kayokyoku",
            k_pop: "k-pop",
            karaoke: "karaoke",
            instrumental: "instrumental",
            brazilian: "brazilian",
            spoken_word: "spoken word",
            disney: "disney",
            french_pop: "french pop",
            german_pop: "german pop",
            german_folk: "german folk"
        }

        
        let result = [];
        for(let i of genres)
        {
            if(i.checked){
                for(let genre in newGenres){
                    if(i.genre == newGenres[genre]){
                        result.push(genre);
                    }
                }
        
            }
                
        }

        return result;
    }

    BackGenresToShowGenres(genres:string[]){
        let show = [];
        const newGenres = {
            blues: "blues",
            children_music: "children music",
            classical: "classical",
            country: "country",
            electronic: "electronic",
            holiday: "holiday",
            opera: "opera",
            singer: "singer/songwriter",
            jazz: "jazz",
            latino: "latino",
            new_age: "new age",
            pop: "pop",
            soul: "r&b/soul",
            musicals: "musicals",
            dance: "dance",
            hip_hop: "hip-hop/rap",
            world: "world",
            alternative: "alternative",
            rock: "rock",
            christian_gospel: "christian & gospel",
            vocal: "vocal",
            reggae: "reggae",
            easy_listening: "easy listening",
            j_pop: "j-pop",
            enka: "enka",
            anime: "anime",
            kayokyoku: "kayokyoku",
            k_pop: "k-pop",
            karaoke: "karaoke",
            instrumental: "instrumental",
            brazilian: "brazilian",
            spoken_word: "spoken word",
            disney: "disney",
            french_pop: "french pop",
            german_pop: "german pop",
            german_folk: "german folk"
        }

       
        for(let i in newGenres){
            for(let gnr of genres){
                if(i==gnr){
                    show.push(newGenres[i])
                }
            }
        }
        return show;
        
    }


}