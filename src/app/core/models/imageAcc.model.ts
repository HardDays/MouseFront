export class ImageAccModelAnswer
{
    constructor(
        public total_count?:number,
        public images?: ImageAccModel[]
    )
    {
        if(!images)
            this.images = [];
    }
}

export class ImageAccModel{
    constructor(
        public id?:number,
        public description?: string,
        public type?:string,
        public type_decs?:string
    ){}
}