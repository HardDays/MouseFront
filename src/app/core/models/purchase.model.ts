export class PurchaseModel{
    constructor(
        public platform = Platforms.PayPal,
        public account_id?: number,
        public tickets?: TicketPurchaseModel[],
        public redirect_url?: string
    ){}

    
}

export class TicketPurchaseModel
{
    constructor(
        public ticket_id?: number,
        public count?: number
    ){}

    public static TicketPurchaseModelFromObject(obj:any): TicketPurchaseModel
    {
        return new TicketPurchaseModel(obj.ticket.id, obj.count);
    }

    public static TicketPurchaseArrayFromObjectArray(arr: any[]): TicketPurchaseModel[]
    {
        let result: TicketPurchaseModel[] = [];

        for(let i of arr)
        {
            result.push(TicketPurchaseModel.TicketPurchaseModelFromObject(i));
        }

        return result;
    }

}

export enum Platforms{
    PayPal = "paypal",
    Yandex = "yandex"
};