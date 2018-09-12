import { Component, OnInit, Input} from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
declare var $:any;
@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css']
})
export class ArtistInfoComponent extends BaseComponent implements OnInit {


  @Input() Artist: AccountGetModel;
  Image:string = BaseImages.NoneFolowerImage;
  IsFollowed:boolean;
  startShowButt:boolean = false;
    hardCode:any = [{
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        },
        {
            link:"https://youtu.be/UOUBW8bkjQ4"
        }

    ]



    ngOnInit(): void {
        this.GetImage();
        this.CheckFollowStatus();
        console.log(this.Artist);

        
    }


    initSlider(){
        console.log('ok');
        $('.slider-video').slick({
            dots: false,
            arrows:true,
            infinite: false,
            speed: 300,
            slidesToShow: 1
        });
    }

    GetVideo(video)
    {
     
        if(this.Artist.videos && this.Artist.videos.length > 0)
        {
            let link = video.link;
            let id = this.GetVideoId(link);
            let path = id? ("https://www.youtube.com/embed/" + id) : "";
            if(path)
            {
                return this.SanitizePath(path);
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
        this.main.accService.IsAccFolowed(this.GetCurrentAccId(), this.Artist.id)
            .subscribe(
                (res)=>{

                    this.IsFollowed = res.status;
                    this.startShowButt = true;
                }
            )
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
