import { Component, OnInit, Input, NgZone, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenreModel } from '../../../core/models/genres.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { AccountType, BaseMessages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-artist-about',
  templateUrl: './artist-about.component.html',
  styleUrls: ['./artist-about.component.css']
})
export class ArtistAboutComponent extends BaseComponent implements OnInit {


  @Input() Artist:AccountCreateModel;
  @Output() OnSave = new EventEmitter<AccountCreateModel>();
  @Output() OnError = new EventEmitter<string>();

  aboutForm : FormGroup = new FormGroup({
    "user_name": new FormControl("", [Validators.required]),
    "display_name": new FormControl("", [Validators.required]),
    "stage_name": new FormControl(""),
    "manager_name": new FormControl(""),
    "artist_email": new FormControl("",[Validators.required, Validators.email]),
    "about": new FormControl("", [Validators.required]),
  });
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;

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

  //##########################################//
  //  INIT

  ngOnInit() {


  }

  Init(artist:AccountCreateModel){
    this.Artist = artist;

    if(!this.Artist.artist_email){
      this.main.authService.GetMe().
        subscribe((res)=>{
          this.Artist.artist_email = res.email;
        })
    }

    this.WaitBeforeLoading(
      ()=>  this.main.genreService.GetAllGenres(),
      (res:string[])=>{
        this.genres = this.main.genreService.StringArrayToGanreModelArray(res);
        for(let i of this.genres) i.show = true;
        this.GetArtistGenres();
      }
    )

    var _the = this;
    $(document).mouseup(function (e) {
      var container = $("#pick-up-genre-modal");
      // console.log(`click`,e,container.has(e.target),_the.showMoreGenres);
      if (container.has(e.target).length === 0 && _the.showMoreGenres){
          _the.showMoreGenres = false;
      }
    });

    console.log(`About Artist`,this.Artist);
  }


  //##########################################//
  //  GENRES

  GengeSearch($event:string){
    var search = $event;
    if(search.length>0) {
      for(let g of this.genres)
          if(g.genre_show.indexOf(search.toUpperCase())>=0)
          g.show = true;
          else
          g.show = false;
    }
    else {
        for(let i of this.genres) i.show = true;
    }
  }

  GetArtistGenres(){
    // console.log(`----`,this.genres,this.Artist);
    if(this.Artist&&this.Artist.genres){
      for(let g of this.Artist.genres){
        for(let gnr of this.genres)
          if(gnr.genre == g) gnr.checked = true;
      }
    }
  }


  //##########################################//
  //  FORM

  artistFromAbout(){
    if(!this.aboutForm.invalid){

        for (let key in this.aboutForm.value) {
            if (this.aboutForm.value.hasOwnProperty(key)) {
                this.Artist[key] = this.aboutForm.value[key];
            }
        }

        this.Artist.account_type = AccountType.Artist;
        this.Artist.genres = this.main.genreService.GenreModelArrToStringArr(this.genres);

        console.log(`Artist from About`,this.Artist);

        this.OnSave.emit(this.Artist);
    }
    else {
      this.showError(this.getFormErrorMessage(this.aboutForm, 'artist'));
    }
  }

  showError(str:string){
    this.OnError.emit(str);
    return;
  }

}
