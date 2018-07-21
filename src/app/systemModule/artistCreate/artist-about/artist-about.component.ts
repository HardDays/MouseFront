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
  @Output() ArtistChange:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

  @Input() ArtistImageId:number = 0;
  @Input() ArtistId:number = 0;

  @Output() onSaveArtist:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
  @Output() onSaveArtistByCircle:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
  @Output() onSaveArtistBySave:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
  

  @Output() onError:EventEmitter<string> = new EventEmitter<string>();
  @Output() onImageDeleted:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onArtistChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

  aboutForm : FormGroup = new FormGroup({
    "user_name": new FormControl("", [Validators.required]),
    "display_name": new FormControl("", [Validators.required]),
    "stage_name": new FormControl(""),
    "manager_name": new FormControl(""),
    "artist_email": new FormControl("",[Validators.required,
      Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]),
    "about": new FormControl("", [Validators.required]),
  });
  genres:GenreModel[] = [];
  showMoreGenres:boolean = false;
  // isNewImage = false;

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

  // ##########################################//
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
        // console.log(`genres`,res);
        this.genres = this.main.genreService.StringArrayToGenreModelArray(res);
        for(let i of this.genres) i.show = true;
          this.GetArtistGenres();
      }
    );

    if(this.ArtistImageId)
      this.WaitBeforeLoading(
        ()=>this.main.imagesService.GetImageById(this.ArtistImageId),
        (img)=>this.Artist.image_base64 = img.base64
      );

    let _the = this;
    $(document).mouseup(function (e) {
      let container = $("#pick-up-genre-modal");
      if (container.has(e.target).length === 0 && _the.showMoreGenres){
          _the.showMoreGenres = false;
      }
    });

  }


  // ##########################################//
  //  GENRES

  GengeSearch($event:string){
    let search = $event;
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
          if(gnr.genre === g) gnr.checked = true;
      }
    }
  }

    // ##########################################//
  //  SAVE

  SaveArtistByCircle()
  {
    if(this.SaveArtist())
      this.onSaveArtistByCircle.emit(this.Artist);
  }

  clickSaveButton(){
    if(this.SaveArtist())
      this.onSaveArtistBySave.emit(this.Artist);
  }

  SaveArtistAndStay(){
    if(this.SaveArtist())
      this.onSaveArtist.emit(this.Artist);
  }

  protected SaveArtist(){
    this.aboutForm.updateValueAndValidity();
    if(this.aboutForm.invalid)
    {
      // console.log(this.aboutForm,this.getFormErrorMessage(this.aboutForm, 'artist'));
      this.onError.emit(this.getFormErrorMessage(this.aboutForm, 'artist'));
        return false;
    }

    this.Artist.genres = [];
    // console.log(this.genres);
    for(let g of this.genres){
      if(g.checked){
        this.Artist.genres.push(g.genre);
      }
    }
    let img = this.Artist.image_base64;
    return true;
 
  }

  uploadImage($event){
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Artist.image_base64 = res;
            // this.isNewImage = true;
        }
    );
  }

DeleteImage()
{
    // console.log(`delete image`,this.Artist,this.ArtistImageId);
    if(this.ArtistImageId && this.ArtistId && this.Artist.image_base64)
    {
        // console.log(`image del`,this.ArtistImageId,this.ArtistId);
        this.DeleteLocalImage();
        this.main.imagesService.DeleteImageById(this.ArtistImageId,this.ArtistId)
            .subscribe(
                (res) => {
                    this.ArtistImageId = 0;
                  //  this.onImageDeleted.emit(true);
                    this.DeleteLocalImage();
                },(err)=>{
                  // console.log(`err`,err)
                }
            );
    }
    else {
        this.DeleteLocalImage();
    }
    // this.DeleteLocalImage();
}

DeleteLocalImage()
{
    this.Artist.image_base64='';
    this.onArtistChanged.emit(this.Artist);
}


}
