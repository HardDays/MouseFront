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

    public static Validate(input: PreferencesModel):PreferencesModel
    {
        let result = new PreferencesModel();

        result.preferred_currency = input.preferred_currency ? input.preferred_currency : Currency.USD;
        result.preferred_username = input.preferred_username ? input.preferred_username : Languages.English;
        result.preferred_date = input.preferred_date ? input.preferred_date : DateFormat.EURO;
        result.preferred_distance = input.preferred_distance ? input.preferred_distance : Distance.Km;
        result.preferred_time = input.preferred_time ? input.preferred_time : TimeFormat.EURO;

        return result;
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
CurrencyIcons[Currency.RUB] = "₽";
CurrencyIcons[Currency.USD] = "$";
CurrencyIcons[Currency.EUR] = "€";

export enum TimeFormat
{
    EURO = "12",
    CIS = "24"
}