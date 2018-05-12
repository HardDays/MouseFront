import { Component } from '@angular/core';

declare var $:any;
@Component({
    selector: 'error-cmp',
    templateUrl: 'error.component.html',
    styleUrls: ['error.component.css']
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
        if($('#message-1').data('bs.modal').isShown)
            $('#message-1').modal('hide');
    }
}
