import { Component } from '@angular/core';

declare var $:any;
@Component({
    selector: 'error-cmp',
    templateUrl: 'error.component.html'
})

export class ErrorComponent{

    public Message:string = '';
    public OpenWindow(message:string)
    {
        this.Message = message;
        $('#message-1').modal('show');
    }

    public CloseWindow()
    {
        $('#message-1').modal('toggle');
    }
}
