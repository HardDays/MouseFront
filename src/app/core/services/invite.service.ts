import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class InviteService{
 
    constructor(private http: HttpService){    
    }


    PostInviteArtist(invite:any){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/artist_invites.json',JSON.stringify(invite))
        );
    }

     PostInviteVenue(invite:any){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/venue_invites.json',JSON.stringify(invite))
        );
    }



}