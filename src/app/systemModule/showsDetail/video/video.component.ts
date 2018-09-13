import { Component, Input, OnInit } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'show-video-slide',
  templateUrl: './video.component.html'
})
export class ShowDetailVideoComponent extends BaseComponent implements OnInit{

    @Input() Artist: AccountGetModel;
    VideoPath:SafeResourceUrl = '';

    ngOnInit(): void  {
        this.GetImage();
    }
    GetImage()
    {
        if(this.Artist.videos && this.Artist.videos.length > 0)
        {
            let link = this.Artist.videos[0].link;
            let id = this.GetVideoId(link);
            let path = id? ("https://www.youtube.com/embed/" + id) : "";
            if(path)
            {
                this.VideoPath = this.SanitizePath(path);
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

}