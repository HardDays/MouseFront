export class FrontWorkingTimeModel{
    constructor(
        public name?:string,
        public start_work?:string,
        public finish_work?:string,
        public checked?:boolean,
        public short_name?:string
    ){
        if(name)
            this.short_name = this.name[0].toUpperCase() + this.name.substr(1,2);
    }
}
