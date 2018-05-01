import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscribable } from 'rxjs/Observable';
import { TypeService } from './type.service';
import { PhoneService } from './phone.service';
import { ImagesService } from './images.service';
import { GenresService } from './genres.service';
import { EventService } from './event.service';
import { AuthService } from 'angular2-social-login';
import { AccountService } from './account.service';
import { AuthMainService } from "./auth.service";
import { GUID } from "../models/guide.model";
import { AccountGetModel } from '../models/accountGet.model';
import { TokenModel } from "../models/token.model";
import { EventGetModel } from "../models/eventGet.model";
import { EventCreateModel } from "../models/eventCreate.model";
import { Base64ImageModel } from "../models/base64image.model";
import { BaseImages } from "../base/base.enum";

@Injectable()
export class MainService{
    public onLoadingChange$: Subject<boolean>;

    public MyAccounts: AccountGetModel[] = [];
    public CurrentAccount:AccountGetModel = new AccountGetModel();
    public CurrentAccountChange: Subject<AccountGetModel>;
    public MyAccountsChange: Subject<AccountGetModel[]>;
    public MyLogo:string = BaseImages.NoneUserImage;
    public MyLogoChange:Subject<string>;
    constructor
    (
        private http         : HttpService,
        private router       : Router,
        public typeService   : TypeService,
        public phoneService  : PhoneService,
        public imagesService : ImagesService,
        public genreService : GenresService,
        public eventService  : EventService,
        public authService   : AuthMainService,
        public accService    : AccountService,
        public _auth         : AuthService     
    ){
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);

        this.CurrentAccountChange = new Subject();
        this.CurrentAccountChange.next(new AccountGetModel());

        this.MyAccountsChange = new Subject();
        this.MyAccountsChange.next([]);

        this.authService.onAuthChange$
            .subscribe(
                (res:boolean) => {
                    console.log(res);
                    if(res)
                    {
                        this.GetMyAccounts();      
                    }
                    else{
                        this.CurrentAccountChange.next(new AccountGetModel());
                        this.MyAccountsChange.next([]);
                        this.router.navigate(['/system','tickets']);
                    }
                }
            );
        
        this.CurrentAccountChange.subscribe(
            (val:AccountGetModel) => 
            {
                this.CurrentAccount = val;
                this.SetCurrentAccId(val.id? val.id : 0);
                this.GetMyLogo();
            }
        );

        this.MyAccountsChange.subscribe(
            (val:AccountGetModel[]) => 
            {
                this.MyAccounts = val;
            }
        );
        this.MyLogoChange = new Subject();
        this.MyLogoChange.next(BaseImages.NoneUserImage);
        this.MyLogoChange.subscribe(
            (val:string)=>{
                this.MyLogo = val;
            }
        )
    }

    GetMyLogo()
    {
        if(this.CurrentAccount && this.CurrentAccount.image_id)
        {

           
               this.imagesService.GetImageById(this.CurrentAccount.image_id).subscribe(
                (res:Base64ImageModel) => {
                    this.MyLogoChange.next(res.base64 ? res.base64 : BaseImages.NoneUserImage);
                },
                (err) => {
                    this.MyLogoChange.next(BaseImages.NoneUserImage);
                }
            );
           
        }
        else{
            this.MyLogoChange.next(BaseImages.NoneUserImage);
        }
    }
    public GetCurrentAccId()
    {
        if(localStorage.getItem('activeUserId'))
            return localStorage.getItem('activeUserId');
        return null;
    }

    public SetCurrentAccId(id:number)
    {
        localStorage.setItem('activeUserId',id.toString());
    }

    public GetMyAccounts(){
        this.accService.GetMyAccount()
            .subscribe(
                (res) => {
                    this.MyAccounts = res;
                    if(this.MyAccounts.length > 0)
                    {
                        let accId = +this.GetCurrentAccId();
                        if(accId)
                        {
                            this.CurrentAccount = this.MyAccounts.find((acc) => acc.id == accId);
                        }
                        else
                        {
                            this.CurrentAccount = this.MyAccounts[0];
                        }
                    }
                    this.CurrentAccountChange.next(this.CurrentAccount);
                    this.MyAccountsChange.next(this.MyAccounts);
                },
                (err) => {
                }
            );
    }
    /* Processes BLOCK END */

}