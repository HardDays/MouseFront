export class Base64ImageModel{
    constructor(
        public id?:number,
        public base64?:string,
        public created_at?:Date,
        public updated_at?:Date
    ){}
}