import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GengreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {

  genres:GengreModel[] = [];
  allGenres:GengreModel[] = [];
  search:string = '';
  artists:AccountGetModel[] = [];
  followsId:number[] = [];
  artistsChecked:boolean[]=[];
  seeMore:boolean = false;
  firstPage:boolean = true;
  Account:AccountCreateModel = new AccountCreateModel();
  User:UserCreateModel = new UserCreateModel();



  ngOnInit(){
   this.genres = this.genreService.GetMin();
    this.allGenres = this.genreService.GetAll();
   console.log(this.genres,this.genreService.genres);
  }


  firstPageComp(){
    this.genreService.GetArtists(this.genres).
      subscribe((res:AccountGetModel[])=>{
    
      this.artists = res;
      
      for(let i=0;i<this.artists.length;i++)
        this.artistsChecked.push(false)
      
      console.log(`artists`, this.artists);
      this.firstPage = false;
     
    });  
  }


  onSubmitSignUp(){
    for(let i=0;i<this.artistsChecked.length;i++)
      if(this.artistsChecked[i]) this.followsId.push(this.artists[i].id);
    this.Account.account_type = 'fan';
    console.log(this.User, this.Account,this.followsId);
    this.CreateUserAcc(this.User,this.Account,this.followsId);
  }

  loadLogo($event:any):void{
    console.log($event.target.files[0]);
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Account.image_base64 = res;
            
        }
    );
  }

  seeMoreGenres(){
    this.seeMore = true;
    let checked = this.genres;
    this.genres = this.genreService.GetAll(checked);

  }

  autocompleListFormatter = (data: GengreModel) : SafeHtml => {
    let html =  `<span style="margin-left:40px;"><b>${data.genre_show}</b></span>`;
    // if(data.parent)html = `<span>${data.parent} : <b>${data.name}</b></span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
}

CategoryChanged($event:string){
   // this.ParamsSearch.category = $event.parent?$event.parent:$event.value;
  //  this.ParamsSearch.sub_category = $event.parent?$event.parent+":"+$event.name:'';
   this.search = $event;
    console.log($event);
    if(this.search.length>0) {
      console.log(`CHANGE`);
    }
    else {
      console.log(`NOT`);
    }
}

}
