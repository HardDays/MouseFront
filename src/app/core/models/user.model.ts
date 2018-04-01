export class UserModel{
    constructor(
        public user_name?: string,
        public display_name?: string,
        public phone?: string,
        public account_type?: string,
        public image_id?: number,
        public bio?: string,
        public address?: string,
        public lat?: number,
        public lng?: number,
        public auth_token?: string
    ){}
}