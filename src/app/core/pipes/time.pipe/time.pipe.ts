import {Pipe, PipeTransform} from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { TimeFormat } from '../../models/preferences.model';

@Pipe({
    name: 'timepipe'
})
export class TimePipe implements PipeTransform{
    constructor(protected settings: SettingsService)
    {
        
    }
    transform(val:string, args) {
        const format = this.settings.GetTimeFormat();
        if(format == TimeFormat.CIS)
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