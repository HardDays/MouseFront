export class UserCreateModel{
    constructor(
        public id?: number,
        public email?: string,
        public user_name?: string,
        public phone?: string,
        public image?:string
    ){}
}