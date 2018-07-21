import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends BaseComponent implements OnInit {

  @Input() isApprovedBy;
  @Input() status;
  @Input() Accounts:AccountGetModel[];
  @Input() Events:any[];

  openIds:number[] = [];

  ngOnInit() {
    // console.log(this.Accounts)
  }

  openAccount(id:number){
    this.router.navigate(["/admin",'account',id])
  }

  openEvent(id:number){
    this.router.navigate(["/admin",'event',id])
  }

  checkIdToOpen(id:number){
    let index = this.openIds.indexOf(id);
    if(index<0)
      this.openIds.push(id);
    else
      this.openIds.splice(index,1);
    
      // console.log(this.openIds);

  }

  openInNewTabs(){
    let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
        window.open('http://localhost:4200/admin/'+type+'/'+id,'_blank');
        // window.open('http://mouse-web.herokuapp.com/admin/'+type+'/'+id,'_blank');
        window.blur();
      }
  }

  deleteAll(){
    let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
      if(type==='account')
      {
        this.main.adminService.AccountDelete(id)
          .subscribe(
            (res)=>{
              console.log(id,`ok`);
              this.Accounts.splice(this.Accounts.indexOf(this.Accounts.find((a)=>a.id===id)),1)
            },
            (err)=>{
              console.log(`err`,err);
            }
          )
      }
      else {
        this.main.adminService.EventDelete(id)
          .subscribe(
            (res)=>{
              console.log(id,`ok`);
              this.Events.splice(this.Events.indexOf(this.Events.find((e)=>e.id===id)),1)
            },
            (err)=>{
              console.log(`err`,err);
            }
          )
      }
        
    }
  }


  getImage(id:number){
    let img = '';
    if(id){
      
      img = this.main.imagesService.GetImagePreview(id,{width:50,height:50})
          
    }
    else
      img = BaseImages.NoneFolowerImage;

    return  {'background-image': 'url('+img+')'};
  }
  // {'background-image': Account.acc.image_id?'url('+Account.image_base64_not_given+')':''}
}
