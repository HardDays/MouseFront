import { Component, HostListener } from '@angular/core';

declare var $:any;
@Component({
    selector: 'error-cmp',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.css']
})


export class ErrorComponent{

    public Message:string = '';
    public isShown:boolean = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(this.isShown){
            if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
                this.CloseWindow()
            }
        }
    }

    public OpenWindow(message:string)
    {
        this.Message = message;
        this.isShown = true;
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