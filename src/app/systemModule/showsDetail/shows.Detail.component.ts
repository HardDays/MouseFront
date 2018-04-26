import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountType } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { MapsAPILoader } from '@agm/core';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { EventService } from '../../core/services/event.service';
import { Http } from '@angular/http';
import { UserGetModel } from '../../core/models/userGet.model';

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
    selector: 'shows-detail-main',
    templateUrl: './showsDetail.component.html',
    styleUrls: ['./showsDetail.component.css'],
})
export class ShowsDetailComponent extends BaseComponent implements OnInit {





    ngOnInit(): void {
    }
}