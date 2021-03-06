import { EventEmitter } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent extends BaseComponent implements OnInit {

  AdminsList:{id:number,user_name:string}[] = [];
  AdminsListOpened:{id:number,user_name:string}[] = [];
  AdminsListAdded:{id:number,user_name:string}[] = [];
  isAdminListOpen = false;

  TextTopic = '';
  TextMessage = '';

  @Output() onCreate = new EventEmitter<boolean>();

  // @ViewChild('searchAdmin') searchAdmin: ElementRef;

  ngOnInit() {
    this.getAdminsList();
  }


  getAdminsList(){
    this.main.adminService.GetAdminsList()
          .subscribe(
            (res)=>{
              this.AdminsList = res;
              this.AdminsListOpened = this.AdminsList;
            }
          )
  }

  openAdminsList(){
    this.isAdminListOpen = !this.isAdminListOpen;
    if(!this.isAdminListOpen)
      this.AdminsListOpened = this.AdminsList.filter(
      obj => !this.AdminsListAdded.find(el=>el.id===obj.id)
    );
  }

  searchAdmin(admin?){
    this.AdminsListOpened = this.AdminsList.filter(
      obj => obj.user_name.toLowerCase().indexOf(admin.target.value.toLowerCase())>=0
      && !this.AdminsListAdded.find(el=>el.id===obj.id)
    );
  }

  hideList(){
    setTimeout(() => {
      this.openAdminsList();
    }, 200);
  }

  sendNewMessage(){
    let AdminsIDs = [];
    for(let item of this.AdminsListAdded)
        AdminsIDs.push(item.id);
    this.main.adminService.SendMessageToNewDialog(AdminsIDs,this.TextMessage,this.TextTopic)
      .subscribe(
        (res)=>{
          this.onCreate.emit(true);
        }
      )
  }

  addAdmin(admin){
    this.AdminsListAdded.push(admin);
    this.hideList();
    // this.openAdminsList();
  }

  deleteAdded(admin){
    this.AdminsListAdded = this.AdminsListAdded.filter(obj=>obj.user_name!=admin.user_name);
    this.hideList();
  }

}
