import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { GenreModel } from '../../../core/models/genres.model';

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
     var ch = "#checkbox-"+index+"-"+index;
     $(ch).addClass('scaled');

    setTimeout(()=>{
      $(ch).removeClass('scaled');
    },120);

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
   
    this.accService.AccountsSearch({text:this.text, limit:20}).
      subscribe((res:AccountGetModel[])=>{
        this.artists = res;
        for(let artist of this.artists)
        if(artist.image_id)
          this.imgService.GetImageById(artist.image_id)
            .subscribe((img)=>{
              console.log(img);
              artist.image_base64_not_given = img.base64;
            });
        else artist.image_base64_not_given = '../../../assets/img/layer-7.jpg';
      });


  }

  followArtists(){

    
    for(let i=0;i<this.artistsChecked.length;i++)
      if(this.artistsChecked[i]) this.followsId.push(this.artists[i].id);
             
    let id:number = +localStorage.getItem('activeUserId');
    for(let follow of this.followsId){
        this.accService.AccountFollow(id,follow).subscribe(()=>{
        });
    }
    
    this.router.navigate(['/system','shows']);
  
  }

  changeText(){
    this.getArtists();
  }

}
