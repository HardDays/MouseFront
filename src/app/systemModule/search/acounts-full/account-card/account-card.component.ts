import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { AccountGetModel } from '../../../../core/models/accountGet.model';
import { BaseImages, AccountType } from '../../../../core/base/base.enum';
import { GenreModel } from "../../../../core/models/genres.model";

@Component({
    selector: 'accounts-card-search-component',
    templateUrl: './account-card.component.html',
    styleUrls: ['./../../search.component.css']
  })
  
  export class AccountCardSearchComponent extends BaseComponent implements OnInit {
      @Input() Account: AccountGetModel;

      Image: string = BaseImages.NoneFolowerImage;
      Genres: GenreModel[] = [];
      IsFollowed = false;

    ngOnInit(): void {
        this.GetGenres();
        this.GetImage();
        if(this.Account.account_type != AccountType.Fan)
        {
            this.CheckFollowStatus();
        }
    }

    GetImage(){
        if(this.Account.image_id)
        {
            this.Image = this.main.imagesService.GetImagePreview(this.Account.image_id, {width:120, height:120});
        }
    }

    GetGenres()
    {
        this.Genres = this.main.genreService.StringArrayToGanreModelArray(this.Account.genres);
    }

    CheckFollowStatus()
    {
        this.main.accService.IsAccFolowed(this.GetCurrentAccId(), this.Account.id)
            .subscribe(
                (res)=>{
                    this.IsFollowed = res.status;
                }
            )
    }

    Follow()
    {
        this.main.accService.FollowAccountById(this.GetCurrentAccId(), this.Account.id)
            .subscribe(
                (res) => 
                {
                    this.IsFollowed = !this.IsFollowed;
                }
            );

    }

    Unfollow()
    {
        this.main.accService.UnFollowAccountById(this.GetCurrentAccId(), this.Account.id)
            .subscribe(
                (res) => {
                    this.IsFollowed = !this.IsFollowed;
                }
            );
    }
    Navigate()
    {
        this.router.navigate(['/system','profile', this.Account.id]);
    }
  }