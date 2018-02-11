import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';


@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})


export class EditComponent extends BaseComponent implements OnInit {

    VenueTypes:SelectModel[] = [];
    SelectedVenue:number = 1;
    hasBar:boolean = true;
    hasVr:boolean = true;
    AccountTypes:SelectModel[] = [];
    SelectedAccount:string = "fan";
    LocationTypes:SelectModel[] = [];
    SelectedLocation:string = "indoors";
    OfficeDays:FrontWorkingTimeModel[] = [];
    OperatingDays:FrontWorkingTimeModel[] = [];
    date:Date;
    UserId:number;
    Account:AccountCreateModel = new AccountCreateModel();;
  
    ngOnInit()
    {
      this.VenueTypes = this.typeService.GetAllVenueTypes();
      this.AccountTypes = this.typeService.GetAllAccountTypes();
      this.LocationTypes = this.typeService.GetAllLocationTypes();
      this.OfficeDays = this.typeService.GetAllDays();
      this.OperatingDays = this.typeService.GetAllDays();
      this.Account = new AccountCreateModel();
      this.Account.emails = [new ContactModel()];
      this.Account.dates = [new EventDateModel()];
      this.Account.office_hours = [new WorkingTimeModel()];
      this.accService.GetMyAccount()
        .subscribe((user:AccountGetModel)=>{
            this.InitByUser(user);
        })
    }
   
  
    InitByUser(usr:AccountGetModel){
      console.log(usr);
      this.Account = this.accService.UserModelToCreateUserModel(usr);
      this.UserId = usr.id?usr.id:0;
      if(usr.image_id){
          this.imgService.GetImageById(usr.image_id)
              .subscribe((res:Base64ImageModel)=>{
                  this.Account.image = res.base64;
              });
      }
  }
    getMask(item:WorkingTimeModel){
      console.log(item.begin_time);
      return {
          mask: [/[0-2]/, item && item.begin_time && parseInt(item.begin_time.toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
          keepCharPositions: true
        };
  } 
  getMaskEnd(item:WorkingTimeModel){
    
    return {
        mask: [/[0-2]/, item && item.end_time && parseInt(item.end_time.toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
      };
  } 
  
    AddEmail()
    {
      this.Account.emails.push(new ContactModel());
    }
  
    DeleteEmail(i:number)
    {
      this.Account.emails.splice(i,1);
    }
    AddVenueDate()
    {
      this.Account.dates.push(new EventDateModel());
    }
  
    DeleteVenueDate(i:number)
    {
      this.Account.dates.splice(i,1);
    }
  
    AddVenueTime()
    {
      this.Account.office_hours.push(new WorkingTimeModel());
    }
  
    DeleteVenueTime(i:number)
    {
      this.Account.office_hours.splice(i,1);
    }
  
    loadLogo($event:any):void{
      let target = $event.target;
      let file:File = target.files[0];
      if(!file)
          return;
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
          this.Account.image = reader.result;
      }
      reader.readAsDataURL(file);
  }



}
