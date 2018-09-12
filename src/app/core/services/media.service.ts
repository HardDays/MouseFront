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

    GeVideoById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_videos/'+id+'.json','')
        );
    }
    GeAlbumById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_albums/'+id+'.json','')
        );
    }
    GeAudioById(account_id:number,id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/artist_audios/'+id+'.json','')
        );
    }

    // CreateAdmin(user:UserCreateModel){
    //     return this.http.CommonRequest(
    //         ()=> this.http.PostData('/admin.json',JSON.stringify(user))
    //     );
    // }


}
