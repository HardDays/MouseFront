import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from "rxjs/Observable";
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

@Injectable()
export class MainService{
    public onAuthChange$: Subject<boolean>;
    public onLoadingChange$: Subject<boolean>;
    public ActiveProcesses:string[] = [];

    private MyAccounts: AccountGetModel[] = [];
    private CurrentAccount:AccountGetModel = new AccountGetModel();

    public CurrentAccountChange: Subject<AccountGetModel>;
    public MyAccountsChange: Subject<AccountGetModel[]>;

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
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);

        this.CurrentAccountChange = new Subject();
        this.CurrentAccountChange.next(new AccountGetModel());

        this.MyAccountsChange = new Subject();
        this.MyAccountsChange.next([]);

        this.authService.onAuthChange$
            .subscribe(
                (res:boolean) =>
                {
                    this.onAuthChange$.next(res);
                }
            )
        
        this.CurrentAccountChange.subscribe(
            (val:AccountGetModel) => 
            {
                this.SetCurrentAcc(val);
                this.SetCurrentAccId(val.id);
            }
        );

        this.MyAccountsChange.subscribe(
            (val:AccountGetModel[]) => 
            {
                this.SetMyAccounts(val);
            }
        );

        this.MyAccounts
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

    public SetMyAccounts(arr:AccountGetModel[])
    {
        this.MyAccounts = arr;
    }
    public GetMyAccounts()
    {
        return this.MyAccounts;
    }

    public GetCurrentAcc()
    {
        return this.CurrentAccount;
    }
    public SetCurrentAcc(acc:AccountGetModel)
    {
        this.CurrentAccount = acc;
    }


    

    /* Processes BLOCK END */

}