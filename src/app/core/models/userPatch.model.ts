export class UserPatchModel{
    constructor(
        public email?: string,
        public password?: string,
        public password_confirmation?: string,
        public old_password?: string
    ){}
}