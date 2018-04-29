import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CheckModel } from '../../../core/models/check.model';
import { GetVenue } from '../../../core/models/eventPatch.model';
import { GetArtists, EventGetModel } from '../../../core/models/eventGet.model';
import { BaseComponent } from '../../../core/base/base.component';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { EventCreateModel } from '../../../core/models/eventCreate.model';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.css']
})
export class FundingComponent extends BaseComponent implements OnInit {

  activeArtist:CheckModel<GetArtists> [] = [];
  activeVenue:CheckModel<GetVenue>[] = [];
  
  artistSum:number = 0;
  venueSum:number = 0;
  additionalCosts:number = 50000;
  familyAndFriendAmount:string = '0%';

    @Input() Event:EventCreateModel;
    @Output() onSaveEvent:EventEmitter<EventCreateModel> = new EventEmitter<EventCreateModel>();
 


  // constructor(protected authService: AuthMainService,
  //             protected accService:AccountService,
  //             protected imgService:ImagesService,
  //             protected typeService:TypeService,
  //             protected genreService:GenresService,
  //             protected eventService:EventService,
  //             protected _sanitizer: DomSanitizer,
  //             protected router: Router,public _auth: AuthService,
  //             private mapsAPILoader: MapsAPILoader, 
  //             private ngZone: NgZone, protected h:Http,
  //             private activatedRoute: ActivatedRoute){
  //     super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
  // }

  ngOnInit() {
    // this.CreateAutocompleteArtist();
    
  }

  Init(event:EventCreateModel){
    this.getActiveArtVen();
  }


  getFamilyAndFriendAmount(){
    let sum =  parseFloat(this.familyAndFriendAmount)/100;
    return sum*(0.1*(this.artistSum+this.venueSum+this.additionalCosts)+(this.artistSum+this.venueSum+this.additionalCosts));
  }


  setActiveArtist(index:number){
    if(!this.activeArtist[index].checked){
        this.activeArtist[index].checked = true;
        this.artistSum += this.activeArtist[index].object.agreement.price;
        this.main.eventService.ArtistSetActive({
            id:this.activeArtist[index].object.artist_id,
            event_id:this.Event.id,
            account_id:this.Event.creator_id
        }).
            subscribe((res)=>{
                //console.log(`active set ok`,res);
                this.updateEvent();
            });
    }
    else {
        this.activeArtist[index].checked = false;
        this.artistSum -= this.activeArtist[index].object.agreement.price;
        this.main.eventService.ArtistRemoveActive({
            id:this.activeArtist[index].object.artist_id,
            event_id:this.Event.id,
            account_id:this.Event.creator_id
        }).
            subscribe((res)=>{
                //console.log(`active remove ok`,res);
                this.updateEvent();
            });
    }
    //console.log(this.activeArtist);

}

setActiveVenue(index:number){
    if(!this.activeVenue[index].checked){
        this.activeVenue[index].checked = true;
        this.venueSum += this.activeVenue[index].object.agreement.price;
        this.main.eventService.VenueSetActive({
            id:this.activeVenue[index].object.venue_id,
            event_id:this.Event.id,
            account_id:this.Event.creator_id
        }).
            subscribe((res)=>{
                //console.log(`active set ok`,res);
                this.updateEvent();
            });
    }
    else {
        this.activeVenue[index].checked = false;
        this.venueSum -= this.activeVenue[index].object.agreement.price;
        this.main.eventService.VenueRemoveActive({
            id:this.activeVenue[index].object.venue_id,
            event_id:this.Event.id,
            account_id:this.Event.creator_id
        }).
            subscribe((res)=>{
                //console.log(`active remove ok`,res);
                this.updateEvent();
            });
    }
    //console.log(this.activeVenue);

}

getNumInArtistOrVenueById(id:number,list:any[]){
  if(id)
      for(let i=0; i<list.length; i++)
          if(list[i].id==id)
              return i;          
}



getActiveArtVen(){

  this.artistSum = 0;
  this.venueSum = 0;
  let artist:GetArtists[] = [], venue:GetVenue[] = [];
  console.log(this.Event);
  if( this.Event&&this.Event.artist)
   for(let art of this.Event.artist)
      if(art.status=='owner_accepted'||art.status=='active'){
          // let num = this.getNumInArtistOrVenueById(art.artist_id,this.showsArtists);
          // art.image_base64_not_given = this.showsArtists[num].image_base64_not_given;
          // art.user_name_not_given =  this.showsArtists[num].user_name;

              //заглушка на старые запросы
              if(!art.agreement.price) art.agreement.price = 1000;

          artist.push(art);
      }
if( this.Event&&this.Event.venues)
  for(let v of this.Event.venues)
      if(v.status=='owner_accepted'||v.status=='active'){
          // let num = this.getNumInArtistOrVenueById(v.venue_id,this.requestVenues);
          // v.image_base64_not_given = this.requestVenues[num].image_base64_not_given;
          // v.user_name_not_given =  this.requestVenues[num].user_name;

          //заглушка на старые запросы
          if(!v.agreement.price) v.agreement.price = 100;
          
          venue.push(v);
  }
  

  this.activeArtist = this.convertArrToCheckModel<GetArtists>(artist);
  this.activeVenue = this.convertArrToCheckModel<GetVenue>(venue);

  let i = 0;
  for(let item of this.activeArtist){
      if(item.object.status=='active'){
          item.checked = true;
          // this.setActiveArtist();
          this.artistSum += this.activeArtist[i].object.agreement.price;
      }
      i = i + 1;
  }
  i = 0;
  for(let item of  this.activeVenue){
      if(item.object.status=='active'){
          item.checked = true;
          this.venueSum += this.activeVenue[i].object.agreement.price;
      }
      i = i + 1;
  }

  console.log(this.activeArtist);
  this.getListImages(this.activeArtist);
  this.getListImages(this.activeVenue);

  //console.log(`active: `,this.activeArtist,this.activeVenue);
}

getListImages(list:any[]){
  if(list)
  for(let item of list)
      if(item.image_id){
          this.main.imagesService.GetImageById(item.image_id)
              .subscribe((res:Base64ImageModel)=>{
                  item.image_base64_not_given = res.base64;
          });
      }
}





updateEvent(){

}

comleteFunding(){
  this.onSaveEvent.emit(this.Event);
}



}
