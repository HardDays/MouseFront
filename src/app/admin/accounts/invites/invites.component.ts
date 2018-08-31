import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';

interface Invite{
  account_id:number,
  account:AccountGetModel,
  description:string,
  email:string,
  facebook:string,
  id:number,
  invited_type:string,
  links:string,
  name:string,
  twitter:string,
  vk:string,
  youtube:string,
  created_at:string,
  instagram:string
}

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css']
})
export class InvitesComponent extends BaseComponent implements OnInit {

  Invites:Invite[] = [];
  NewInvites:Invite[] = [];

  ScrollArtistDisabled = false;

  Type = 'all';

  ngOnInit() {
    this.main.adminService.GetInvites(50,0,this.Type)
      .subscribe(
        (res)=>{
          this.NewInvites = res;
          this.getAccounts();
        }
      )
  }

  getAccounts(){
    for(let i of this.NewInvites){
      this.main.accService.GetAccountById(i.account_id)
        .subscribe(
          (res)=>{
            i.account = res;
            i.account.image_base64_not_given = this.main.imagesService.GetImagePreview(i.account.image_id,{width:120,height:120});
          }
        )
    }
    this.Invites.push(...this.NewInvites);
  }

  openHref(href){
    window.open(`http://`+href);
  }
  openMail(mail){
    window.location.href = "mailto:"+mail+"?subject=Mouse&body=Welcome!";
  }

  getMoreInvites(){
    this.ScrollArtistDisabled = true;
    this.main.adminService.GetInvites(50,this.Invites.length,this.Type)
      .subscribe(
        (res)=>{
          this.NewInvites = res;
          this.getAccounts();
          this.ScrollArtistDisabled = false;
        }
      )
  }

  ChangeType(type){
    this.Type = type;
    this.Invites = [];
    this.getMoreInvites();
  }

}
