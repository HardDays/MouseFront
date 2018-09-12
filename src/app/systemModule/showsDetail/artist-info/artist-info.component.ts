import { Component, OnInit, Input } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';

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
 
    ngOnInit(): void {
        this.GetImage();
        this.CheckFollowStatus();
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
