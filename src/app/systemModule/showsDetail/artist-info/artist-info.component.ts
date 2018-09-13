import { Component, OnInit, Input, NgZone, ChangeDetectorRef} from '@angular/core';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
import { EventBackersModel } from '../../../core/models/eventBackers.model';
import { AccountGetModel, Video } from '../../../core/models/accountGet.model';
declare var $:any;
@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css']
})
export class ArtistInfoComponent extends BaseComponent implements OnInit{


  @Input() Artist: AccountGetModel;
  Image:string = BaseImages.NoneFolowerImage;
  IsFollowed:boolean;
  startShowButt:boolean = false;
  Videos: Video[] = [];
  activeSlide:number = 0;
  activeSlideVideo:any;
  

    constructor(
        protected main           : MainService,
        protected _sanitizer     : DomSanitizer,
        protected router         : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        protected activatedRoute : ActivatedRoute,
        protected cdRef          : ChangeDetectorRef,
        protected translate      :TranslateService,
        protected settings       :SettingsService
    ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
    }

    ngOnInit(): void {
        this.GetImage();
        this.CheckFollowStatus();
       
        if(this.Artist.videos.length != 0){
            this.main.MediaService.GevideosById(this.Artist.id).subscribe((res:any)=>{
            this.Videos = res;
                this.GetVideo();
            });

            
            
        }
    }
    SlideRight(){
        this.activeSlide+=1;
        this.GetVideo();
    }
    Slideleft(){
        this.activeSlide-=1;
        this.GetVideo();
    }
    

    GetVideo()
    {
     
        if(this.Artist.videos && this.Artist.videos.length > 0)
        {
        
            let link = this.Videos[this.activeSlide].link;
            let id = this.GetVideoId(link);
            let path = id? ("https://www.youtube.com/embed/" + id) : "";
            if(path)
            {
                this.activeSlideVideo = this.SanitizePath(path);
            }
        }
    }
    

    GetVideoId(url:string)
    {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return false;
        }
    }

    SanitizePath(path:string)
    {
        return this._sanitizer.bypassSecurityTrustResourceUrl(path);
    }






    GetImage()
    {
        if(this.Artist.image_id)
        {
            this.Image = this.main.imagesService.GetImagePreview(this.Artist.image_id,{width: 500, height: 500});
        }
    }
    Navigate()
    {
        this.router.navigate(['/system','profile', this.Artist.id]);
    }
    CheckFollowStatus()
    {
        if(this.GetCurrentAccId()){
        this.main.accService.IsAccFolowed(this.GetCurrentAccId(), this.Artist.id)
            .subscribe(
                (res)=>{

                    this.IsFollowed = res.status;
                    this.startShowButt = true;
                }
            )
        }
    }
    Follow()
    {
        this.main.accService.FollowAccountById(this.GetCurrentAccId(), this.Artist.id)
            .subscribe(
                (res) => 
                {
                    this.IsFollowed = !this.IsFollowed;
                }
            );

    }

    Unfollow()
    {
        this.main.accService.UnFollowAccountById(this.GetCurrentAccId(), this.Artist.id)
            .subscribe(
                (res) => {
                    this.IsFollowed = !this.IsFollowed;
                }
            );
    }
}
