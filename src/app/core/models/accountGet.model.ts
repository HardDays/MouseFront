import { AccountType } from '../base/base.enum';
export class AccountGetModel{
    constructor(
        public id?: number,
        public user_name?: string,
        public display_name?: string,
        public phone?: string,
        public created_at?: string,
        public updated_at?: string,
        public image_id?: number,
        public account_type?: AccountType
){}
}