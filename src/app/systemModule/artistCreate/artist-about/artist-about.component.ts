import { Component, OnInit, Input, NgZone, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, Output, SimpleChanges } from '@angular/core';
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
  @Input() ArtistImageId:number = 0;
  @Input() ArtistId:number = 0;

  @Output() onSaveArtist:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
  @Output() onError:EventEmitter<string> = new EventEmitter<string>();
  @Output() onImageDeleted:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onArtistChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

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
    this.CreateOnModelChangeForParent();
    this.Init();
  }
  
  CreateOnModelChangeForParent()
  {
      this.aboutForm.valueChanges.forEach(
          (value:any) => {
              this.onArtistChanged.emit(this.Artist);
          }
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.Artist)
        this.Artist = changes.Artist.currentValue;
    if(changes.ArtistImageId)
        this.ArtistImageId = changes.ArtistImageId.currentValue;
    if(changes.ArtistId)
        this.ArtistId = changes.ArtistId.currentValue;
    this.Init();
  }

  Init(){
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
      if (container.has(e.target).length === 0 && _the.showMoreGenres){
          _the.showMoreGenres = false;
      }
    });

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
    if(this.Artist&&this.Artist.genres){
      for(let g of this.Artist.genres){
        for(let gnr of this.genres)
          if(gnr.genre == g) gnr.checked = true;
      }
    }
  }

    //##########################################//
  //  SAVE

  SaveArtist()
  {
      this.aboutForm.updateValueAndValidity();
      if(this.aboutForm.invalid)
      {
          this.onError.emit(this.getFormErrorMessage(this.aboutForm, 'artist'));
          return;
      }

      this.Artist.genres = [];
      for(let g of this.genres){
        if(g.checked){
          this.Artist.genres.push(g.genre);
        }
      }
      
      this.onSaveArtist.emit(this.Artist);
  }


}
