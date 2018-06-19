export class UserCreateModel{
    constructor(
        public first_name?:string,
        public last_name?:string,
        public user_name?:string,
        public image_base64?:string,
        public email?: string,
        public password?: string,
        public password_confirmation?: string,
        public register_phone?:string,
        public image_id?:number,
    ){}
}