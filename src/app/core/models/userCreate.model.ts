export class UserCreateModel{
    constructor(
        public email?: string,
        public password?: string,
        public password_confirmation?: string,
        public register_phone?:string
    ){}
}