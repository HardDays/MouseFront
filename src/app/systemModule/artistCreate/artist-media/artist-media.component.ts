import { Component, OnInit, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel, Audio } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var audiojs:any;
declare var $:any;

@Component({
  selector: 'app-artist-media',
  templateUrl: './artist-media.component.html',
  styleUrls: ['./artist-media.component.css']
})
export class ArtistMediaComponent extends BaseComponent implements OnInit {

  @Input() Artist:AccountCreateModel;
  
  addSongForm: FormGroup = new FormGroup({        
    "song_name": new FormControl("", [Validators.required]),
    "album_name": new FormControl("", [Validators.required]),
    "audio_link": new FormControl("", [Validators.required])
  });
  addAlbumForm: FormGroup = new FormGroup({        
    "album_artwork": new FormControl("", [Validators.required]),
    "album_name": new FormControl("", [Validators.required]),
    "album_link": new FormControl("", [Validators.required])
  });
  addVideoForm: FormGroup = new FormGroup({        
    "album_name": new FormControl("", [Validators.required]),
    "name": new FormControl("", [Validators.required]),
    "link": new FormControl("", [Validators.required])
  });

  openVideoLink:any;
  ArtistImages:{img:string,text:string,id:number}[] = [];
  imageInfo:string = '';
  ImageToLoad:string = '';


  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }

  ngOnInit() {

        setTimeout(() => {
      var as = audiojs.createAll();
     }, 200);

  }

  Init(artist:AccountCreateModel){
    this.Artist = artist;
    console.log(`Artist MEDIA`,this.Artist);
  }

  addAudio(){
  if(!this.addSongForm.invalid){
    let params:Audio = new Audio();
    for (let key in this.addSongForm.value) {
      if (this.addSongForm.value.hasOwnProperty(key)) {
          params[key] = this.addSongForm.value[key];
      }
    }
    this.Artist.audio_links.push(params);
    // 'http://d.zaix.ru/6yut.mp3'
    

    // this.updateArtistByCreateArtist();
  }
  else {
    //console.log(`Invalid Audio Form!`, this.aboutForm);
  }
    
  }

  deleteAudio(index:number){
    this.Artist.audio_links.splice(index,1);
    // this.updateArtistByCreateArtist();
  }

  addAlbum(){}
  deleteAlbum(index){}

  addVideo(){}
  deleteVideo(index){}
  openVideo(){}

  loadImage(){}

  DeleteImageFromLoading(){}

  AddVenuePhoto(){}

  deleteImage(){}

}
