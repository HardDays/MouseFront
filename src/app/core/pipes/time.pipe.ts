import {Pipe} from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Pipe({
    name: 'timepipe'
})
export class TimePipe{
    constructor(protected settings: SettingsService)
    {
        
    }
    transform(val:string, args) {
        const format = this.settings.GetSettings().TimeFormat;
        if(format == '24')
        {
            return val;
        }
        const parts = val.split(':');
        let h = ((+parts[0]) % 12).toString();
        if(h.length == 1)
        {
            h = '0' + h;
        }
        let result = h;
        result += ':' + parts[1] + ' ';
        result += (+parts[0] > 11)? 'PM' : 'AM';
        return result;
    }
}