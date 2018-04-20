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
  artistsChecked:boolean[]=[];
  genres:GenreModel[] = [];
  
  ngOnInit() {

    this.genreService.GetAllGenres()
    .subscribe((res:string[])=>{
      this.genres = this.genreService.StringArrayToGanreModelArray(res);
      this.getArtists();
    });

  }

  clickItem(index:number){
    //console.log(index);
     var ch = "#checkbox-"+index+"-"+index;
     $(ch).addClass('scaled');

    setTimeout(()=>{
      $(ch).removeClass('scaled');
    },120)
  }

  
  getArtists(){
    this.genreService.GetArtists(this.genres).
    subscribe((res:AccountGetModel[])=>{
  
    this.artists = res;
    
    for(let i=0;i<this.artists.length;i++)
      this.artistsChecked.push(false);

      
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

}
