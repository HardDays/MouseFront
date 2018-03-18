export class CheckModel{
    constructor(
        public object?:any,
        public checked?:boolean
    ){
        if(!checked) this.checked = false;
    }
}