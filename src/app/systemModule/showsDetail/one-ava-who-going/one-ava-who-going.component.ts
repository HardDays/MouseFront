import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommentEventModel } from '../../../core/models/commentEvent.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
import { TopBackers } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-one-ava-who-going',
  templateUrl: './one-ava-who-going.component.html',
  styleUrls: ['./one-ava-who-going.component.css']
})
export class OneAvaWhoGoingComponent extends BaseComponent implements OnInit {
  @Input() human:TopBackers;
  Image: string = BaseImages.NoneFolowerImage;
  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
) {
super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
}


  ngOnInit() {
    this.GetImage();
    console.log(this.human);
  }
  

  GetImage(){
    if(this.human.image_id)
    {
        this.Image = this.main.imagesService.GetImagePreview(this.human.image_id, {width:80, height:80});
    }
  }
  Navigate(){
      this.router.navigate(['/system','profile', this.human.id]);
  }

}
