import { Component, OnInit, Input, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommentEventModel } from '../../../core/models/commentEvent.model';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
import { EventBackersModel } from '../../../core/models/eventBackers.model';


@Component({
  selector: 'app-one-human-going-modal',
  templateUrl: './one-human-going-modal.component.html',
  styleUrls: ['./one-human-going-modal.component.css']
})
export class OneHumanGoingModalComponent extends BaseComponent implements OnInit {
  someBacker:EventBackersModel = new EventBackersModel();
  Image: string = BaseImages.NoneFolowerImage;
  @Input() backer:EventBackersModel;
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
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initBacker();
   
  }

  initBacker(){
    this.someBacker = this.backer;
    this.GetImage();
  }
  GetImage(){
    if(this.someBacker.image_id)
    {
        this.Image = this.main.imagesService.GetImagePreview(this.someBacker.image_id, {width:150, height:150});
    }
  }

}
