import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'emptypipe'
})
export class EmptyPipe implements PipeTransform{

    transform(val:string, args) {
        if (val && val.length > 0)
            return val;
    
        return "-";
    }
}