import { Component, OnInit, Input, NgZone, ChangeDetectorRef, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AccountCreateModel, Rider } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import * as FileSaver from 'file-saver';
import { RiderComponent } from './rider/rider.component';

@Component({
  selector: 'app-artist-riders',
  templateUrl: './artist-riders.component.html',
  styleUrls: ['./artist-riders.component.css']
})
export class ArtistRidersComponent extends BaseComponent implements OnInit {

  @Input() Artist:AccountCreateModel;

  @Output() OnSave = new EventEmitter<AccountCreateModel>();
  @Output() OnSaveButton = new EventEmitter<AccountCreateModel>();
  
  @Output() OnError = new EventEmitter<string>();
  @Output() openNextPage = new EventEmitter();

  @ViewChild('STAGE') STAGE: RiderComponent;
  @ViewChild('BACKSTAGE') BACKSTAGE: RiderComponent;
  @ViewChild('HOSPITALITY') HOSPITALITY: RiderComponent;
  @ViewChild('TECHNICAL') TECHNICAL: RiderComponent;

  riders:Rider[] = [];
  stageRider:Rider= new Rider();
  backstageRider:Rider= new Rider();
  hospitalityRider:Rider= new Rider();
  technicalRider:Rider= new Rider();
  
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
    //this.getRiders();
  }
  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes.Artist)
          {
            this.Artist = changes.Artist.currentValue;
            this.getRiders();
          }
  }

  Init(artist:AccountCreateModel){
    this.Artist = artist;
    this.getRiders();
  }


  getRiders(){
    if(this.Artist&&this.Artist.artist_riders){
      this.riders = [];
      for(let r of this.Artist.artist_riders){
        this.riders.push(r);
        if(r.rider_type=='stage')
          this.stageRider = r;
        else if(r.rider_type=='backstage')
          this.backstageRider = r;
        else if(r.rider_type=='hospitality')
          this.hospitalityRider = r;
        else if(r.rider_type=='technical')
          this.technicalRider = r;
      }
    }
  }

  DeleteRiderById(id:number){
    let index = this.riders.indexOf(this.riders.find(r=>r.id===id));
    if(index>=0){
      this.riders.splice(index,1);
      this.Artist.artist_riders = this.riders;
      this.saveArtist();
    }
  }

  ConfirmRider(rider:Rider){
    console.log(rider,this.riders);
    if(rider.id){
      let index = this.riders.indexOf(this.riders.find(r=>r.id===rider.id));
      if(index>=0){
        this.riders.splice(index,1);
      }
    }
    this.riders.push(rider);
    this.Artist.artist_riders = this.riders;
    this.saveArtist(); 
  }

  saveArtist(){
    console.log(`to save`, this.Artist);
    this.OnSave.emit(this.Artist);
  }

  isSaveAllRiders(){
    // console.log(this.STAGE.isConfirmRider,this.BACKSTAGE.isConfirmRider,this.HOSPITALITY.isConfirmRider,this.TECHNICAL.isConfirmRider);
    return this.STAGE.isConfirmRider &&
    this.BACKSTAGE.isConfirmRider &&
    this.HOSPITALITY.isConfirmRider &&
    this.TECHNICAL.isConfirmRider;
    // this.saveArtist();

  }



  nextPage(){
    this.saveArtist();
    this.openNextPage.emit();
  }





}
