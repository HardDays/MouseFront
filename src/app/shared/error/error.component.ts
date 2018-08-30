import { Component, HostListener } from '@angular/core';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';



declare var $:any;
@Component({
    selector: 'error-cmp',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.css']
})


export class ErrorComponent{
    constructor(private translate: TranslateService, private settings: SettingsService){

    }

    public Message:string = '';
    public isShown:boolean = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;
    // translate: TranslateService;
    // settings: SettingsService;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(this.isShown){
            if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
                this.CloseWindow()
            }
        }
    }

    public OpenWindow(message:string)
    {
        let mes: string;
        this.Message = message;
        this.isShown = true;
        console.log(this.Message);
        
        mes = this.translate.parser.getValue(this.translate.store.translations[this.settings.GetLang()],this.Message);
        if (mes)
            this.Message = mes;
        console.log(this.Message);
        $('#message-1').modal('show');

    }

    public CloseWindow()
    {
        if($('#message-1').data('bs.modal').isShown)
            $('#message-1').modal('hide');
        this.isShown = false;
    }

    pressEnter(){
        // console.log(`pressEnter`);
    }


}


// <form (keydown)="someMethod($event)">
//      <input type="text">
// </form>
// someMethod(event:any){
//    if(event.keyCode == 13){
//       alert('Entered Click Event!');
//    }else{
//    }
// }