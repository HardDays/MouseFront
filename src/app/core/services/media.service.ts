import { Video } from './../models/accountGet.model';
import { Album, Audio } from './../models/accountCreate.model';
import { Injectable } from "@angular/core";
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';
import { TypeService } from "./type.service";

@Injectable()
export class MediaService{

    constructor(private http: HttpService, private typeService:TypeService){
    }

    GetVideosById(account_id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_videos.json','')
        );
    }
    GeVideoById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_videos/'+id+'.json','')
        );
    }
    AddVideo(account_id:number,video:Video){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts/'+account_id+'/artist_videos.json',JSON.stringify(video))
        );
    }
    DeleteVideo(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/accounts/'+account_id+'/artist_videos/'+id+'.json',JSON.stringify({account_id,id}))
        );
    }

    GetAlbumsById(account_id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_albums.json','')
        );
    }
    GeAlbumById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_albums/'+id+'.json','')
        );
    }
    AddAlbum(account_id:number,album:Album){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts/'+account_id+'/artist_albums.json',JSON.stringify(album))
        );
    }
    DeleteAlbum(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/accounts/'+account_id+'/artist_albums/'+id+'.json',JSON.stringify({account_id,id}))
        );
    }

    GetAudiosById(account_id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_audios.json','')
        );
    }
    GeAudioById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_audios/'+id+'.json','')
        );
    }
    AddAudio(account_id:number,audio:Audio){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts/'+account_id+'/artist_audios.json',JSON.stringify(audio))
        );
    }
    DeleteAudio(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/accounts/'+account_id+'/artist_audios/'+id+'.json',JSON.stringify({account_id,id}))
        );
    }

}
