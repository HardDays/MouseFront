import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountCreateModel, Rider } from '../../../../core/models/accountCreate.model';
import { saveAs} from 'file-saver';
declare const Buffer;
@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css']
})
export class RiderComponent extends BaseComponent implements OnInit {
  @Input('Type') Type: string;
  @Input('Rider') Rider: Rider;
  @Input('Artist') Artist: AccountCreateModel;
  @Input('ArtistId') ArtistId: number;

  @Output() onDelete = new EventEmitter<number>();
  @Output() onConfirm = new EventEmitter<Rider>();
  @Output() onError = new EventEmitter<string>();


  isConfirmRider:boolean = true;

  RidersDesc = {
    'Stage' : 'Type or Upload your requirements for the Stage (Stage, Audio, Video, Lighting)',
    'Backstage'  : 'Type or Upload your requirements for the Backstage (Dressing Room/Makeup Room/Bathroom)',
    'Hospitality'  : 'Type or Upload your preference for Hospitality (Food and Drinks)',
    'Technical'  : 'Type or Upload your requirements for Musical Instruments and Equipment'
  };

  isEng: boolean;

  ngOnInit() {
    this.isEng = this.isEnglish();
    if(this.Rider){
      if(!this.Rider.is_flexible)
        this.Rider.is_flexible = false;
    }
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if(changes.Rider){
  //     // console.log(`!!!`,this.Rider)
  //     if(this.Rider.id) this.isConfirmRider = true;
  //       else  this.isConfirmRider = false;
  //   }


  // }

  loadRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];

    if(file.size<=2e7)
      this.getBase64(file);
    else
      this.onError.emit(`Very big file size!`);
    // for(let file of target.files)
    // {
    //     let reader:FileReader = new FileReader();
    //     reader.onload = (e) =>{
    //     this.Rider.uploaded_file_base64 = reader.result;
    //     this.isConfirmRider = false;
    //   }
    //   reader.readAsDataURL(file);
    // }
  }

 getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = (e)=>{
    //  console.log(reader.result);
     this.Rider.uploaded_file_base64 = reader.result+'';
    //     this.isConfirmRider = false;
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}


  deleteRider(){
    if(this.Rider.id){
      this.main.accService.DeleteArtistRider(this.ArtistId,this.Rider.id)
        .subscribe( (res)=>{
          this.Rider = new Rider();
          this.isConfirmRider = true;
          this.onDelete.emit(this.Rider.id);
        }
      )
    }
    else {
      this.Rider = new Rider();
      this.isConfirmRider = true;
    }

  }



  confirmRider(){
    if(this.Rider.uploaded_file_base64){
      this.getRiderInfo();
      this.main.accService.SaveArtistRider(this.ArtistId,this.Rider)
        .subscribe((res)=>{
          this.isConfirmRider = true;
        })
      // this.onConfirm.emit(this.Rider);

    }
  }

  getRiderInfo(){
    this.Rider.rider_type = this.Type.toLowerCase();

    if(!this.Rider.is_flexible)
      this.Rider.is_flexible = false;
    else
      this.Rider.is_flexible = true;
    // this.Artist.artist_riders.push(this.Rider);
  }

  downloadTemplate(){
    const blob = new Blob(['124'],
      { type: 'application/vnd.ms-excel;charset=utf-16le' });
     const file = new File([blob], 'template.xls',
      { type: 'application/vnd.ms-excel;charset=utf-16le' });

    //   var url = window.URL.createObjectURL(file);
      // url.download = '';
      // window.open(url);
     // saveAs(blob, filename+".txt");

     let blob2 = new Blob([], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      });

      saveAs(file, "template.xls");
  }

  downloadFile(data: Response){
    // if(this.Rider.id){
    //   this.main.accService.GetRiderById(this.Rider.id)
    //   .subscribe((res)=>{
    if(this.Rider.uploaded_file_base64){
        let type = this.Rider.uploaded_file_base64.split(';base64,')[0].split('/')[1];
        console.log(this.Rider.uploaded_file_base64.split(';base64,')[0]);
        let file = this.Rider.uploaded_file_base64.split(';base64,')[1];

        var decoded = new Buffer(file, 'base64');
        var blob = new Blob([decoded], { type: type });
        if(type==='plain')type='txt';
        else if(type==='vnd.openxmlformats-officedocument.wordprocessingml.document')type='docx';

        saveAs(blob,'Rider.'+type);

      // }, (err)=>{
      //   // console.log(err);
      // })
    }
  }


}



