export class CheckModel<T>{
    constructor(
        public object?:T,
        public checked?:boolean
    ){
        if(!checked) this.checked = false;
    }
}