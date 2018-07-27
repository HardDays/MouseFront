import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { GenreModel } from '../../../core/models/genres.model';
import { BaseImages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-register-follow',
  templateUrl: './register-follow.component.html',
  styleUrls: ['./register-follow.component.css']
})
export class RegisterFollowComponent extends BaseComponent implements OnInit {

  artists:AccountGetModel[] = [];
  followsId:number[] = [];
  artistsChecked:number[]=[];
  genres:GenreModel[] = [];
  text:string = '';

  ngOnInit() {
    this.getArtists();
  }

  clickItem(index:number,id:number){
     let ch = "#checkbox-"+index+"-"+index;

    let ind = this.followsId.indexOf(id);
    if( ind === -1) {
      this.followsId.push(id);
    }
    else {
      this.followsId.splice(ind,1);
    }
  }

  ifArtistChecked(id:number){
    let ind = this.followsId.indexOf(id);
    if( ind === -1) {
     return false;
    }
    else {
      return true;
    }
  }


  
  getArtists(){
    this.WaitBeforeLoading(
      ()=>this.main.accService.AccountsSearch({text:this.text, limit:20,sort_by_popularity:true,type:'artist'}),
      (res:AccountGetModel[])=>{
        this.artists = res;
        for(let artist of this.artists){
          if(artist.image_id)
            this.main.imagesService.GetImageById(artist.image_id)
              .subscribe((img)=>{
                artist.image_base64_not_given = img.base64;
              });
          else artist.image_base64_not_given = BaseImages.NoneUserImage;
        }
      });
  }

  followArtists(){

    
    for(let i=0;i<this.artistsChecked.length;i++)
      if(this.artistsChecked[i]) this.followsId.push(this.artists[i].id);
  
    let id:number = +this.main.GetCurrentAccId();
    for(let follow of this.followsId){
      this.WaitBeforeLoading(
        ()=>this.main.accService.AccountFollow(id,follow),
        (res)=>{
        }
    )
   
    }
    
    localStorage.removeItem('is_register');
    this.router.navigate(['/system','shows']);
  
  }

  changeText(){
    this.getArtists();
  }

}
