import { Component, OnInit, Input, OnChanges, Output, EventEmitter, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserGetModel } from '../../../core/models/userGet.model';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() User: UserCreateModel;
  @Output() OnSave = new EventEmitter<UserCreateModel>();

  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  
  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }
  
  
  ngOnInit() {
    console.log(`init!`);
  }
  ngOnChanges(){
    console.log(`infooo`);
  }

  // SaveUser(){
  //   console.log(`save click`);
  //   this.OnSave.emit(this.User);
  // }

  SaveUser(){
   // console.log(`save user`,this.User);
    this.main.authService.UpdateUser(this.User)
      .subscribe(
          (res)=>{
              this.User = res;
              this.errorCmp.OpenWindow(BaseMessages.Success);
              console.log(`res`,this.User);
          },
          (err)=>{
              console.log(`err`,err);
          }
      );
}
  

}
