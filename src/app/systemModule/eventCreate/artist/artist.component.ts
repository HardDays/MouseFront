import { Component, OnInit, NgZone, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { BaseComponent } from '../../../core/base/base.component';
import { GetArtists, EventGetModel } from '../../../core/models/eventGet.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';
import { AccountSearchModel } from '../../../core/models/accountSearch.model';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent extends BaseComponent implements OnInit {

   
  @Input('artists') artistsList: {artist_id:number,status:string}[] = [];
  @Input('event') Event: EventGetModel;
  @Output('submit') submit = new EventEmitter<boolean>();

  @ViewChild('searchArtist') public searchElementArtist: ElementRef;

  Artists:AccountGetModel[] = [];
  artistForRequest:AccountGetModel = new AccountGetModel();
  addArtist:AccountAddToEventModel = new AccountAddToEventModel();
  
  artistSearchParams:AccountSearchModel = new AccountSearchModel();
  genresSearchArtist:GenreModel[] = []; // список жанров для поиска артистов
  artistsSearch:CheckModel<AccountGetModel>[] = []; // артисты, которые удовлятворяют поиску

  mapCoords =  {lat:55.755826, lng:37.6172999};
  firstOpen:boolean = true;

  isAcceptedArtistShow:boolean = true;
  showModalRequest:boolean = false;

  requestArtistForm : FormGroup = new FormGroup({        
    "time_frame": new FormControl(""),
    "is_personal": new FormControl(""),
    "estimated_price": new FormControl(""),
    "message": new FormControl("")
});

  constructor(protected authService: AuthMainService,
              protected accService:AccountService,
              protected imgService:ImagesService,
              protected typeService:TypeService,
              protected genreService:GenresService,
              protected eventService:EventService,
              protected _sanitizer: DomSanitizer,
              protected router: Router,public _auth: AuthService,
              private mapsAPILoader: MapsAPILoader, 
              private ngZone: NgZone, protected h:Http,
              private activatedRoute: ActivatedRoute){
      super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
  }

  ngOnInit() {
    this.CreateAutocompleteArtist();
  }

  ngOnChanges(changes: SimpleChanges) {
   
      if (changes['artistsList']) {
        if(this.artistsList.length>0&&this.Artists.length==0){
          this.GetArtists();
        }
      }
    
  }

  
  CreateAutocompleteArtist(){
    this.mapsAPILoader.load().then(
        () => {
          
         let autocomplete = new google.maps.places.Autocomplete(this.searchElementArtist.nativeElement, {types:[`(cities)`]});
        
        
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                    if(place.geometry === undefined || place.geometry === null )
                    {             
                        return;
                    }
                    else 
                    {
                        // this.artistSearchParams.address = autocomplete.getPlace().formatted_address;
                        // this.artistSearch();
                        // this.mapCoords.artist.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                        // this.mapCoords.artist.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    }
                });
            });
        }
    );
  }

  GetArtists(){
    for(let i of this.artistsList){
      let ind = 0;
      this.accService.GetAccountById(i.artist_id)
        .subscribe((acc:AccountGetModel)=>{
          acc.status_not_given = i.status;
          if(acc.image_id){
            this.imgService.GetImageById(acc.image_id).
              subscribe((img)=>{
                acc.image_base64_not_given = img.base64;
                this.Artists.push(acc);
              })
          }
          else this.Artists.push(acc);
        })
    }
  }

  artistSearch($event?:string){
    
    if($event) this.artistSearchParams.text = $event;

    this.artistSearchParams.type = 'artist';
    //this.artistSearchParams.genres = this.genreService.GenreModelArrToStringArr(this.genresSearchArtist);

     this.accService.AccountsSearch(this.artistSearchParams).
         subscribe((res)=>{
             if(res.length>0){
                let temp = this.convertArrToCheckModel<AccountGetModel>(res);
                
                for(let art of this.artistsSearch){
                  if(art.checked){
                    let isFind = false;
                    
                    for(let t of temp)
                      if(t.object.id==art.object.id){
                        t.checked = art.checked;
                        isFind = true;
                        break;
                      }
                    if(!isFind) temp.push(art);
                  }
                }
                this.artistsSearch = temp;
                console.log(this.artistsSearch);
                 //console.log(`artists`,this.artistsList);
                //  this.getListImages(this.artistsList);
             }
     });
  }
  artistOpenMapModal(){
    
  }


  addNewArtistOpenModal(){
    $('#modal-pick-artist').modal('show');
    
  }
  




  acceptArtistCard(card:AccountGetModel){
    //console.log(idArtist);

    // this.ownerAcceptDecline.account_id = this.Event.creator_id;
    // this.ownerAcceptDecline.id = card.id;
    // this.ownerAcceptDecline.event_id = this.Event.id;
    // let msgId = this.getIdAtMsg(card.id);
    // this.ownerAcceptDecline.message_id = msgId;
    //  let msg = this.messagesList[0];
    // for(let m of this.messagesList)
    //     if(m.id == msgId) msg = m;
    // this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
    // this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

    // console.log( this.ownerAcceptDecline);
    // this.eventService.ArtistAcceptOwner(this.ownerAcceptDecline).
    //     subscribe((res)=>{
    //         console.log(`ok accept artist`,res);
    //         this.updateEvent();
    //     });

}


declineArtist(card:AccountGetModel){

  // this.ownerAcceptDecline.account_id = this.Event.creator_id;
  // this.ownerAcceptDecline.id = card.id;
  // this.ownerAcceptDecline.event_id = this.Event.id;
  // let msgId = this.getIdAtMsg(card.id);
  // this.ownerAcceptDecline.message_id = msgId;
  //  let msg = this.messagesList[0];
  // for(let m of this.messagesList)
  //     if(m.id == msgId) msg = m;
  // this.ownerAcceptDecline.datetime_from = msg.message_info.preferred_date_from;
  // this.ownerAcceptDecline.datetime_to =  msg.message_info.preferred_date_to;

  // console.log( this.ownerAcceptDecline);
  // this.eventService.ArtistDeclineOwner(this.ownerAcceptDecline).
  //     subscribe((res)=>{
  //         console.log(`ok decline artist`,res);
  //         this.updateEvent();
  //     });

}

sendArtistRequestOpenModal(artist:AccountGetModel){
  this.showModalRequest = true;
    setTimeout(() => {
      $('#modal-send-request-artist').modal('show');
    }, 50);
  
   this.artistForRequest = artist;
  // // this.eventForRequest.user_name
  // //console.log(this.eventForRequest);
}

updateEvent(){

}

artistSendRequest(id:number){
  for (let key in this.requestArtistForm.value) {
      if (this.requestArtistForm.value.hasOwnProperty(key)) {
          this.addArtist[key] = this.requestArtistForm.value[key];
      }
  }
  this.addArtist.id = id;
  this.addArtist.event_id = this.Event.id;
  this.addArtist.account_id = this.Event.creator_id;
  console.log(`request artist`,this.addArtist);

  // this.eventService.ArtistSendRequest(this.addArtist)
  // .subscribe((send)=>{
  //     this.updateEvent();
  // })
}






}
