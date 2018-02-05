import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable } from '@angular/core';
import { MainService } from '../services/main.service';
import { Router, Params } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Subscribable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { error } from 'util';
import { GUID } from '../models/guide.model';
import { UserCreateModel } from '../models/user-create.model';
import { TokenModel } from '../models/token.model';
import { Base64ImageModel } from '../models/base64image.model';
import { AuthService } from "angular2-social-login";

@Injectable()
export class BaseComponent{
    private ActiveProcesses:string[] = [];
    public isLoading:boolean = false;
    public isLoggedIn:boolean = false;
    public userStatus:number = 0;
    public Me:UserCreateModel = new UserCreateModel();
    public MyLogo:string = '';

    public NewErrForUser:boolean = false;
    
    constructor(protected service: MainService, protected router: Router,public _auth: AuthService) {
        
        this.isLoggedIn = this.service.IsLogedIn();

        if(this.isLoggedIn){
            this.GetMyData();
        }

        this.service.onAuthChange$
            .subscribe((res:boolean)=>{
                this.isLoggedIn = res;
                if(this.isLoggedIn){
                    this.GetMyData();
                }
                else
                    this.router.navigate(['/login']);
            });
        
        
        this.service.onLoadingChange$
            .subscribe((val:boolean)=>{
                if(this.ActiveProcesses.length == 0){
                    this.isLoading = false;
                }
                else{
                    this.isLoading = true;
                }
            });   
    }


    CreateUserAcc(user:UserCreateModel, password){
        this.WaitBeforeLoading(
            ()=>this.service.CreateUser(user.email,password,user.phone),
                (res)=>{

                    console.log(res.token);
                    let token:TokenModel = new TokenModel();
                    token.token = res.token;
                    this.service.BaseInitAfterLogin(token);
                    //this.service.BaseInitAfterLogin

                    this.service.CreateAccount(user.user_name,location,user.image).
                    subscribe((acc)=>{
                        console.log('ok acc:',acc);
                        this.router.navigate(['/system','open']);
                    },
                (err)=>{
                    console.log('err',err);
                }
                    );

                },
                (err)=>{

                });
        

    }

    
    protected Login(email:string,password:string,callback:(error)=>any){
        this.WaitBeforeLoading(
            ()=>this.service.UserLogin(email,password),
            (res:TokenModel)=>{
                this.service.BaseInitAfterLogin(res);
                this.router.navigate(['/system','open']);
            },
            (err)=>{
                callback(err);
            }
        );
    }

    protected SocialLogin(provider){
        if(provider=='google'||provider=='facebook'){
            let sub:any;
            sub = this._auth.login(provider).subscribe(
            (data) => {
                        console.log(data);
                        let socToken:any;
                        socToken = data;
                        if (provider=="google")
                            this.service.UserLoginByGoogle(socToken.token).
                            subscribe((res)=>{
                                console.log(`g:`,res);
                                this.service.BaseInitAfterLogin(res);
                                    this.router.navigate(['/system','open']);
                            });
        
                        else if (provider=="facebook")
                            this.service.UserLoginByFacebook(socToken.token).
                            subscribe((res)=>{
                                console.log(`f:`,res);
                                this.service.BaseInitAfterLogin(res);
                                this.router.navigate(['/system','open']);
                            });
                        }
            )
        }
    }

    protected SocialLogout(provider){
        if(provider=='gf')
        this._auth.logout().subscribe(
            (data)=>{//return a boolean value.
            } 
          );
    }

    

    private GenerateProcessID(){
        let id:string = GUID.GetNewGUID();
        this.ActiveProcesses.push(id);
        this.SetLoading();
        return id;
    }

    private DeleteProcess(str:string){
        let index = this.ActiveProcesses.findIndex(x=>x == str);
        this.ActiveProcesses.splice(index,1);
        this.SetLoading();
    }

    protected GetMyData(){
        //this.GetMyAccess();     
        this.GetMe();
    }

    protected GetImageById(id:number,callback:(res:any)=>any, errCallback?:(obj?:any)=>void){
        if(id){
            this.WaitBeforeLoading(
                ()=>this.service.GetImageById(id),
                (res:Base64ImageModel)=>{
                    if(callback && typeof callback == "function"){
                        callback(res);
                    }
                },
                (err)=>{
                    console.log(err);

                    if(callback && typeof callback == "function"){
                        callback(false);
                    }
                    if(errCallback && typeof errCallback == "function"){
                        errCallback();
                    }
                }
            );
        }
        else{
            if(callback && typeof callback == "function"){
                callback(false);
            }
        }
    }

    // protected GetMyImage(callback?:()=>any){
    //     this.GetImageById(
    //         this.Me.image_id,
    //         (res:Base64ImageModel)=>{
    //             this.MyLogo = res.base64;
    //             if(callback && typeof callback == "function"){
    //                 callback();
    //             }
    //         }
    //     ); 
    // }

    protected ReadImages(files:any,callback?:(params?)=>any){
        for(let f of files){
            let file:File = f;
            if(!file){
               break;
            }
            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                callback(myReader.result);
            }
            myReader.readAsDataURL(file);
        }
    }


    protected GetMe(callback?:()=>any){
        this.WaitBeforeLoading(
            ()=>this.service.GetMe(),
            (res)=>{
                this.Me = res;
                //this.GetMyImage(callback);
            },
            (err)=>{
                if(callback && typeof callback == "function"){
                    callback();
                }
            }
        );

    }
    
    // protected GetMyAccess(callback?:(params:any)=>void){
    //     this.WaitBeforeLoading(
    //         ()=>this.service.GetMyAccess(),
    //         (res:any)=>{
    //             this.SetUserStatus(res.role);
               
    //             if(callback && typeof callback == "function"){
    //                 callback(res);
    //             }
    //         },
    //         (err)=>{
    //             this.SetUserStatus('');
    //             if(callback && typeof callback == "function"){
    //                  callback(false);
    //             }
    //         }
    //     );
    // }


    // private SetUserStatus(role:string, first?:boolean){
        
        

    //     this.service.SetupLocalUserStatus(this.userStatus);


    //     if(+this.userStatus <= 1){
    //         this.Logout();
    //         this.NewErrForUser = true;
    //     } 
        
    //     else{
    //         this.NewErrForUser = false;
    //         if(location.pathname=='/login' || location.pathname=='/system/registration')
    //         {  
    //             this.router.navigate(['/system','table']);
    //             //location.reload();
    //         }
    //     }

    // }

    public Logout(){
        this.service.Logout();
       
    }
    

    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>{
        let process = this.GenerateProcessID();
        
        fun()
            .subscribe(
                res=>{
                    success(res);
                    this.DeleteProcess(process);
                },
                error=>{
                    
                    if(err && typeof err == "function"){
                        err(error); 
                    }
                    this.DeleteProcess(process);
                    if(error.status == 401){
                        this.Logout();
                        return;
                    }
                });
    }

    protected SetLoading = () => {
        this.service.onLoadingChange$.next(true);
    }

}