import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';


@Component({
  selector: 'app-private-res',
  templateUrl: './private-res.component.html',
  styleUrls: ['./private-res.component.css']
})
export class PrivateResComponent extends BaseComponent implements OnInit {
  
  @Input() EventId:number;
  @Output() OnCreate = new EventEmitter<boolean>();

  addVenue:AccountAddToEventModel = new AccountAddToEventModel();
  
  privateVenueForm : FormGroup ;
  privateVenueCreate:AccountCreateModel = new AccountCreateModel();
  privateVenue:AccountGetModel = new AccountGetModel();
  imagesListPrivateRes:string[] = [];

  ngOnInit() {
    this.privateVenueForm = new FormGroup({        
            "user_name": new FormControl("", [Validators.required]),
            "phone": new FormControl(""),
            "capacity": new FormControl(),
            "country": new FormControl(""),
            "city": new FormControl(""),
            "address":new FormControl(),
            "description": new FormControl(""),
            "venue_video_links": new FormArray([
                new FormControl("http://")
            ]),
            "link_two": new FormControl(""),
            "has_vr": new FormControl("")
        });
  }
      //
    addPriateVenue(){
        if(!this.privateVenueForm.invalid){

            this.addVenue.event_id = this.EventId;
            
            for (let key in this.privateVenueForm.value) {
                if (this.privateVenueForm.value.hasOwnProperty(key)) {
                        this.privateVenueCreate[key] = this.privateVenueForm.value[key];
                }
            }

            if(this.privateVenueCreate.has_vr != true)
                this.privateVenueCreate.has_vr = false;

            this.privateVenueCreate.account_type = 'venue';
            this.privateVenueCreate.venue_type = 'private_residence';

          

            this.WaitBeforeLoading(
                ()=>  this.main.accService.CreateAccount(this.privateVenueCreate),
                (acc:AccountGetModel)=>{
                    this.privateVenue = acc;
                   
                    
                    this.addVenue.venue_id = acc.id;
                    this.addVenue.account_id = this.main.CurrentAccount.id;

                    this.main.eventService.AddVenue(this.addVenue).
                        subscribe((res)=>{
                            this.OnCreate.emit(true);
                        });

                        for(let img of this.imagesListPrivateRes){
                            this.main.accService.PostAccountImages(acc.id,img)
                             .subscribe((res)=>{
                         }); 
                         }
               
                },
                (err)=>{
                    //console.log(`err`,err);
                }
            );
        }
        else {
            //console.log(`Invalid About Form!`, this.privateVenueForm);
        }
    }

    addPhone(){
        (<FormArray>this.privateVenueForm.controls["venue_video_links"]).push(new FormControl("http://", Validators.required));
    }
    loadPhoto($event:any):void{
        this.ReadImages(
            $event.target.files,
            (res:string)=>{
                this.imagesListPrivateRes.push(res);
                
            }
        );
    }

}
