import {Pipe} from '@angular/core';
import { BaseComponent } from '../../base/base.component';

@Pipe({
    name: 'phone'
})

export class PhonePipe extends BaseComponent{
    transform(val:string, args) {

        if(!val)
            return 'No phone';
        if(val[0]==='+')
            val = val.substring(1);

        let phone = '';

        let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();

        let code_arr = codes.filter((c)=>val.startsWith(c.dial_code)&&this.getPointCount(c['format'])===val.length);

        if(code_arr.length>0){
          let code = code_arr[0];

          if(code&&code['format']){

              let index = 0;
              // if(val[index]==='+')index++;

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
        }
        return phone.length?phone:'+'+val;
    }

    getPointCount(format:string){
      let count = 0;
      for(let i=0;i<format.length;i++)
        if(format[i]==='.')
          count++;
      return count;
    }
}
