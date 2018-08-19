export class PurchaseModel{
    constructor(
        public platform = Platforms.PayPal,
        public account_id?: number,
        public ticket_id?: number,
        public count?: number,
        public redirect_url?: string
    ){}

    public ExportFromTicket(ticket:any)
    {
        this.ticket_id = ticket.ticket_id;
        this.account_id = ticket.account_id;
        this.count = ticket.count;
    }
}

export enum Platforms{
    PayPal = "paypal",
    Yandex = "yandex"
};