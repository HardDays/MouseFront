import {Pipe} from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Pipe({
    name: 'phone'
})

export class PhonePipe extends BaseComponent{
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
        //val = val.charAt(0) != 0 ? '0' + val : '' + val;
        // let newStr = '';
        // let i;
        // for(i=0; i < (Math.floor(val.length/2) - 1); i++){
        //    newStr = newStr+ val.substr(i*2, 2) + ' ';
        // }
        // return newStr+ val.substr(i*2);
        return phone?phone:val;
    }
}
