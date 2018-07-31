export class PreferencesModel{
    constructor(
        public preferred_username?: string,
        public preferred_date?: string,
        public preferred_distance?: string,
        public preferred_currency?: string,
        public preferred_time?: string
    )
    {
        if(!preferred_username)
            this.preferred_username = Languages.English;

        if(!preferred_date)
            this.preferred_date = DateFormat.EURO;

        if(!preferred_distance)
            this.preferred_distance = Distance.Km;

        if(!preferred_currency)
            this.preferred_currency = Currency.USD;
        
        if(!preferred_time)
            this.preferred_time = TimeFormat.EURO;

    }
}

export enum Languages 
{
    Russian = "ru",
    English = "en"
}

export enum DateFormat
{
    EURO = "MM/DD/YYYY",
    CIS = "DD.MM.YYYY",
    ISO = "YYYY-MM-DD"
}

export enum Distance
{
    Mi = "mi",
    Km = "km"
}

export enum Currency
{
    RUB = "RUB",
    USD = "USD",
    EUR = "EUR"
}

export var CurrencyIcons = [
];
CurrencyIcons["RUB"] = "₽";
CurrencyIcons["USD"] = "$";
CurrencyIcons["EUR"] = "€";

export enum TimeFormat
{
    EURO = "12",
    CIS = "24"
}