import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from "@angular/core";
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from "../../../core/models/eventGet.model";
import { MainService } from "../../../core/services/main.service";
import { DomSanitizer} from "@angular/platform-browser";
import { Router, ActivatedRoute} from "@angular/router";
import { MapsAPILoader } from "@agm/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "../../../core/services/settings.service";
import { Data } from '../showDetail.data';

@Component({
    selector: 'payment-show-detail',
    templateUrl: './payment.component.html',
    styleUrls: ['./../showsDetail.component.css']
})
export class PaymentShowDetailComponent extends BaseComponent implements OnInit {
    // @Input() Show: EventGetModel;
    constructor(
        protected main           : MainService,
        protected _sanitizer     : DomSanitizer,
        protected router         : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        protected activatedRoute : ActivatedRoute,
        protected cdRef          : ChangeDetectorRef,
        protected translate      :TranslateService,
        protected settings       :SettingsService,
        private data : Data
    ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
    }
    ngOnInit(): void {
        console.log(this.data);
    }
}