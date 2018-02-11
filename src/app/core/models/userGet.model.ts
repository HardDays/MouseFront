export class UserGetModel{
    constructor(
        public id?:number,
        public email?: string,
        public created_at?:string,
        public updated_at?:string,
        public google_id?:number,
        public twitter_id?:number,
        public vk_id?:number,
        public register_phone?:number,
        public token?:string
    ){}
}