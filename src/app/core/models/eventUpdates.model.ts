export class EventUpdatesModel{
    constructor(
        public action?:string,
        public created_at?:Date,
        public field?:string,
        public type?:string
    ){}
}
