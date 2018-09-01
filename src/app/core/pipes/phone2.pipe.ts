import {Pipe} from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Pipe({
    name: 'phone2'
})

export class Phone2Pipe extends BaseComponent{
    transform(val, args) {
        if(!val)
            return 'No phone';
        
        let phone = '';
        // console.log(`val`,val);

        let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();

        let code_arr = codes.filter((c)=>val.indexOf(c.dial_code)>0&&val.indexOf(c.dial_code)<4);
        let code = code_arr.find((c)=>val[1]===c.dial_code);
        if(!code)code = code_arr[0];
        let dial_code = code.dial_code;
        if(code['format']){
            // console.log(`format`,code['format']);
            let index = 0;
            if(val[index]==='+')index++;

            for(let c of code['format']){
                if(c==='.')
                {
                    phone+=val[index]?val[index]:'';
                    index++;
                }
                else{
                    phone+=c;
                }
            }
        }

        phone = phone.replace('_','');
       
        return phone.length?phone:val;
    }
}