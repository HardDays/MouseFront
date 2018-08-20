import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
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
import { QuestionsService } from "./questions.service";
import { FeedbacksService } from "./feedbacks.service";
import { FeedService } from "./feed.service";
import { CommentService } from "./comment.service";
import { LikesService } from "./likes.service";
import { UserCreateModel } from "../models/userCreate.model";
import { UserGetModel } from "../models/userGet.model";
import { AdminService } from "./admin.service";
import { SettingsService } from "./settings.service";

declare var $:any;

@Injectable()
export class MainService{

    public MyUser: UserGetModel = new UserGetModel;
    public UserChange: Subject<UserGetModel>;
    public MyAccounts: AccountGetModel[] = [];
    public CurrentAccount:AccountGetModel = new AccountGetModel();
    public CurrentAccountChange: Subject<AccountGetModel>;
    public MyAccountsChange: Subject<AccountGetModel[]>;
    public MyLogo:string = BaseImages.NoneUserImage;
    public MyUserLogo:string = BaseImages.NoneUserImage;
    public MyLogoChange:Subject<string>;
    public MyUserLogoChange:Subject<string>;

    public ActiveProcesses:string[] = [];
    public ActiveProcessesChanges: Subject<string[]>;

    constructor
    (
        private http         : HttpService,
        private router       : Router,
        public typeService   : TypeService,
        public phoneService  : PhoneService,
        public imagesService : ImagesService,
        public genreService  : GenresService,
        public eventService  : EventService,
        public authService   : AuthMainService,
        public accService    : AccountService,
        public questService  : QuestionsService,
        public feedbkService : FeedbacksService,
        public feedService   : FeedService,
        public commentService: CommentService,
        public likesService  : LikesService,
        public adminService  : AdminService,
        public _auth         : AuthService,
        public activeRouter  : ActivatedRoute,
        public settings      : SettingsService
    ){

        this.UserChange = new Subject();
        this.UserChange.next(new UserGetModel());

        this.CurrentAccountChange = new Subject();
        this.CurrentAccountChange.next(new AccountGetModel());

        this.MyAccountsChange = new Subject();
        this.MyAccountsChange.next([]);

        this.authService.onAuthChange$
            .subscribe(
                (res:boolean) => {
                    if(res)
                    {
                        this.GetMyUser();
                        this.GetMyAccounts();
                        this.settings.GetBackSettings(); 
                    }
                    else{ 
                        this.UserChange.next(new UserGetModel());
                        this.CurrentAccountChange.next(new AccountGetModel());
                        this.MyAccountsChange.next([]);
                        this.router.navigate(['/system','tickets']);
                    }
                }
            );

        // this.settings.SettingsChange.subscribe(
        //     (res) => {
        //         console.log("settings", this.settings.GetSettings());
        //     }
        // );

        this.UserChange.subscribe(
            (val:UserGetModel) => 
            {
                this.MyUser = val;
                // this.SetCurrentAccId(val.id? val.id : 0);
                // this.GetMyLogo();
                this.GetMyUserLogo();
            }
        );
        
        this.CurrentAccountChange.subscribe(
            (val:AccountGetModel) => 
            {
                this.CurrentAccount = val;
                this.SetCurrentAccId(val.id? val.id : 0);
                this.GetMyLogo();
                //this.GetMyUserLogo();
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

        this.MyUserLogoChange = new Subject();
        this.MyUserLogoChange.next(BaseImages.NoneUserImage);
        this.MyUserLogoChange.subscribe(
            (val:string)=>{
                this.MyUserLogo = val;
            }
        )

        this.ActiveProcessesChanges = new Subject();
        this.ActiveProcessesChanges.next([]);
        this.ActiveProcessesChanges
            .subscribe(
                (val:string[]) => {
                }
            );

        this.router.events.subscribe(
            (event) => {
                if (event instanceof NavigationStart) {
                    ////asdasdsadssa
                    $("body").removeClass("has-active-menu");
                    $(".mainWrapper").removeClass("has-push-left");
                    $(".nav-holder-3").removeClass("is-active");
                    $(".mask-nav-3").removeClass("is-active");
                }
                else if( event instanceof NavigationEnd)
                {
                    window.scrollTo(0,0);
                }
            }
        );
    }

    GetMyLogo()
    {
        if(this.CurrentAccount && this.CurrentAccount.image_id)
        {
            this.MyLogoChange.next(this.imagesService.GetImagePreview(this.CurrentAccount.image_id,{width:40, height:40}));
            
        }
        else{
            this.MyLogoChange.next(BaseImages.NoneUserImage);
        }
    }

    GetMyUserLogo()
    {
        if(this.MyUser && this.MyUser.image_id)
        {      
            this.MyUserLogoChange.next(this.imagesService.GetImagePreview(this.MyUser.image_id,{width:40, height:40}));  

            //    this.imagesService.GetImageById(this.MyUser.image_id).subscribe(
            //     (res:Base64ImageModel) => {
            //         this.MyUserLogoChange.next(res.base64 ? res.base64 : BaseImages.NoneUserImage);
            //     },
            //     (err) => {
            //         this.MyUserLogoChange.next(BaseImages.NoneUserImage);
            //     }
            // );
           
        }
        else{
            this.MyUserLogoChange.next(BaseImages.NoneUserImage);
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

    public GetMyAccounts(callback?:()=>void){
        this.WaitBeforeLoading(
            ()=> this.accService.GetMyAccount({extended:true}),
            (res) => {
                this.MyAccounts = res;
                if(this.MyAccounts.length > 0)
                {
                    let accId = +this.GetCurrentAccId();
                    if(accId)
                    {
                        this.CurrentAccount = this.MyAccounts.find((acc) => acc.id === accId);
                    }
                    else
                    {
                        this.CurrentAccount = this.MyAccounts[0];
                    }
                }
                this.CurrentAccountChange.next(this.CurrentAccount);
                this.MyAccountsChange.next(this.MyAccounts);
                if(callback && typeof callback == "function")
                {
                    callback();
                }
            },
            (err) => {
            }
        );
       
    }

    public GetMyUser(){
        this.WaitBeforeLoading(
            ()=> this.authService.GetMe(),
            (res) => {
                this.MyUser = res;
            
                this.GetMyUserLogo();
                // if(this.MyUser.image_id){
                //     this.imagesService.GetImageById(this.MyUser.image_id)
                //         .subscribe((res)=>{
                //             this.MyUser.image_base64 = res.base64;
                //             this.MyUserLogo = this.MyUser.image_base64;
                //             this.MyUserLogoChange.next(this.MyUser.image_base64);
                //         })
                // }
                
                // if(this.MyUser)
                // {
                //         this.CurrentAccount = this.MyAccounts.find((acc) => acc.id === accId);
                    
                // }
                this.UserChange.next(this.MyUser);
                // this.UserChange.next(this.MyAccounts);
            },
            (err) => {
            }
        );
    }

    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>
    {
        let process = this.GenerateProcessID();
        fun()
            .subscribe(
                res => {
                    success(res);
                    this.DeleteProcess(process);
                },
                error => {                    
                    
                    this.DeleteProcess(process);
                    if(err && typeof err === "function"){
                        err(error); 
                    }
                }
            );
    }

    private GenerateProcessID()
    {
        let id:string = GUID.GetNewGUID();
        this.ActiveProcesses.push(id);
        this.ActiveProcessesChanges.next(this.ActiveProcesses);
        return id;
    }

    private DeleteProcess(str:string)
    {
        let index = this.ActiveProcesses.findIndex(x=>x === str);
        if(index !== -1)
            this.ActiveProcesses.splice(index,1);
        this.ActiveProcessesChanges.next(this.ActiveProcesses);
    }
}