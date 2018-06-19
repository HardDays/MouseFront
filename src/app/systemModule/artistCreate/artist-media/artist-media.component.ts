import { Component, OnInit, NgZone, ChangeDetectorRef, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel, Audio, Album, Video } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { BaseMessages } from '../../../core/base/base.enum';

// declare var audiojs:any;
declare var $:any;
declare var SC:any;

@Component({
  selector: 'app-artist-media',
  templateUrl: './artist-media.component.html',
  styleUrls: ['./artist-media.component.css']
})
export class ArtistMediaComponent extends BaseComponent implements OnInit {

  @Output() onSave = new EventEmitter<AccountCreateModel>();
  @Output() onError = new EventEmitter<string>();
  @Output() openNextPage = new EventEmitter();

  @Input() Artist:AccountCreateModel;
  @Input() ArtistId:number;

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

  // openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/8WPsUv1ZUdw?rel=0');
  openVideoLink:any;
  isVideoOpen:boolean = false;
  ArtistImages:{img:string,text:string,id:number}[] = [];
  imageInfo:string = '';
  ImageToLoad:string = '';
  isImageLoading:boolean = false;

  audioId:number = 0;
  audioDuration:number = 0;
  audioCurrentTime:number = 0;
  player:any;

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

  ngOnInit(){
    this.getAllMedia();
    SC.initialize({
      client_id: "b8f06bbb8e4e9e201f9e6e46001c3acb",
    });
  }

  ngOnChanges(changes:SimpleChanges){
    if(!changes['Artist'].isFirstChange()){
      this.getAllMedia();
    }
  }

  getAllMedia(){
    this.InitMusicPlayer();
   this.updateVideosPreview();
   this.GetArtistImages();
  }

  Init(artist:AccountCreateModel,id:number){
    this.Artist = artist;
    this.ArtistId = id;
  }

  InitMusicPlayer(){
    setTimeout(() => {
      // let as = audiojs.createAll();
     }, 100);
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
      this.saveArtist();
      this.addSongForm.reset();
      this.InitMusicPlayer();
      // 'http://d.zaix.ru/6yut.mp3'

    }
    else {
      this.showError(this.getFormErrorMessage(this.addSongForm, 'artist'));
    }
  }

  deleteAudio(index:number){
    this.Artist.audio_links.splice(index,1);
    this.saveArtist();
  }

  playAudio(s:string){
  
    if(this.player&&  this.player.isPlaying())
      this.player.pause();

    console.log(s);
    this.audioDuration = 0;
    this.audioCurrentTime = 0;
    SC.resolve(s).then((res)=>{
      console.log(res);
      SC.stream('/tracks/'+res.id).then((player)=>{
        this.player = player;
        this.player.play();
  
        player.on('play-start',()=>{
          this.audioDuration = this.player.getDuration();
        })
        
        setInterval(()=>{
           this.audioCurrentTime = this.player.currentTime();
        },100)
        
        // setTimeout(()=>{
        //   player.pause()
        //   player.seek(0)
        // },10000)
  
      });

    },(err)=>{console.log(`ERROR`)})
  }

  stopAudio(){
    this.player.pause();
  }

  addAlbum(){
    if(!this.addAlbumForm.invalid){
      let params:Album = new Album();
      for (let key in this.addAlbumForm.value) {
        if (this.addAlbumForm.value.hasOwnProperty(key)) {
            params[key] = this.addAlbumForm.value[key];
        }
      }
      this.Artist.artist_albums.push(params);
      this.saveArtist();
      this.addAlbumForm.reset();
    }
    else {
      this.showError(this.getFormErrorMessage(this.addAlbumForm, 'artist'));
    }
  }

  deleteAlbum(index:number){
    this.Artist.artist_albums.splice(index,1);
    this.saveArtist();
  }

  addVideo(){
    if(!this.addVideoForm.invalid){
      let params:Video = new Video();
      for (let key in this.addVideoForm.value) {
        if (this.addVideoForm.value.hasOwnProperty(key)) {
            params[key] = this.addVideoForm.value[key];

        }
      }
      this.Artist.artist_videos.push(params);
      this.saveArtist();
      this.addVideoForm.reset();
    }
    else {
      this.showError(this.getFormErrorMessage(this.addVideoForm, 'artist'));
    }
  }

  deleteVideo(index:number){
    this.Artist.artist_videos.splice(index,1);
    this.saveArtist();
  }

  updateVideosPreview(){

    for(let video of this.Artist.artist_videos){
      let video_id ='';

      if(video.link.indexOf('youtube')!== -1)
        video_id = video.link.split('v=')[1];
      if(video.link.indexOf('youtu.be')!== -1)
        video_id = video.link.split('be/')[1];

      video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
    }
  }

  openVideo(video:Video){

    let video_id ='';
    if(video.link.indexOf('youtube') !== -1){
      video_id = video.link.split('v=')[1];

    }
    if(video.link.indexOf('youtu.be') !== -1){
      video_id = video.link.split('.be/')[1];
    }


    this.openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video_id+'?rel=0');
    this.isVideoOpen = true;

    setTimeout(()=>{
      $('#modal-movie').modal('show');
      $('#modal-movie').on('hidden.bs.modal', () => {
        this.isVideoOpen = false;
      })
    },100);
  }


  loadImage($event:any):void{
    let target = $event.target;
    if(target.files.length === 0)
        return;

    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
          this.ImageToLoad = reader.result;
      }
      reader.readAsDataURL(file);
    }

  }

  DeleteImageFromLoading(){
    this.ImageToLoad = '';
  }

  AddArtistPhoto(){

  this.isImageLoading = true;
 // this.WaitBeforeLoading(
    // ()=> 
    this.main.imagesService.PostAccountImage(this.ArtistId,{image_base64:this.ImageToLoad,image_description: this.imageInfo})
      .subscribe(
        (res:any)=>{
          console.log(`res`,res);
          this.ArtistImages.push({img:this.ImageToLoad, text: this.imageInfo,id:res.image_id});
          this.ImageToLoad = '';
          this.imageInfo = '';
          this.isImageLoading = false;
          this.GetArtistImages();
        },
        (err)=>{
          this.isImageLoading = false;
        }
    );
  }

 

GetArtistImages()
{
  // this.ArtistImages = [];
  this.isImageLoading = true;
  this.main.imagesService.GetAccountImages(this.ArtistId,{limit:5})
    .subscribe(
      (res:any)=>{
        if(res && res.total_count > 0)
        {
          this.ArtistImages = [];
          for(let img of res.images)
          {
            let txt = img.description?img.description:'';
            this.GetArtistImageById(img.id,txt);
          }
          // this.isImageLoading = false;  
        }
        else {
          this.isImageLoading = false;     
        }
      }
    ,(err)=>{
      this.isImageLoading = false;
    }
  );
}


GetArtistImageById(id,text)
{
  this.isImageLoading = true;
  this.main.imagesService.GetImageById(id)
    .subscribe(
      (res:Base64ImageModel) =>{
        this.ArtistImages.push({img:res.base64,text:text,id:res.id});
        this.isImageLoading = false;
      }
    );

}

SanitizeImage(image: string)
{
  return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
}


deleteImage(id:number){
  // this.WaitBeforeLoading(
    // ()=> 
    this.isImageLoading = true;
    this.main.imagesService.DeleteImageById(id,this.ArtistId)
      .subscribe(
        (res)=>{
          this.ArtistImages = [];
          this.GetArtistImages();
        },(err)=>{
          this.showError(this.getResponseErrorMessage(err, 'artist'));
          this.isImageLoading = false;
        }
      )
}

  clearNewElements(){
    this.addSongForm.reset();
    this.addAlbumForm.reset();
    this.addVideoForm.reset();
  }

  saveArtist(){
    let scrollHeight = window.pageYOffset;

    this.onSave.emit(this.Artist);

    setTimeout(() => {
      window.scrollTo(0,scrollHeight);
    }, 1100);
    
  }

  showError(str:string){
    this.onError.emit(str);
    return;
  }

  nextPage(){
    this.openNextPage.emit();
  }



}
