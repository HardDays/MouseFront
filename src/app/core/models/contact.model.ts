export class ContactModel{
    constructor(
        public name?:string,
        public email?:string
    )
    {
        if(!name)
            this.name = "";

        if(!email)
            this.email = "";
    }
}