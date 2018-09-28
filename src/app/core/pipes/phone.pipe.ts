import {Pipe} from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Pipe({
    name: 'phone'
})

export class PhonePipe extends BaseComponent{
    transform(val:string, args) {
      if(!val){
          return 'No phone';
      }
      if(val[0]==='+'){
        val = val.substr(1);
      }

      let phone = '';
      let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();

      let code_arr = codes.filter((c)=>val.startsWith(c.dial_code));
      let code = code_arr.find((c)=>val.startsWith(c.dial_code,1));

      if(!code)
        code = code_arr[0];

      if(code&&code['format']){
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
      return '+'+phone.length?phone:val;
    }
}
