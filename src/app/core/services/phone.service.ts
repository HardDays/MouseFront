import { Injectable } from "@angular/core";
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';
import { TypeService } from "./type.service";


@Injectable()
export class PhoneService{

    
    constructor(private http: HttpService, private typeService:TypeService){
     
    }

    GetAllPhoneCodes(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/phone_validations/codes.json','')
        );
    }

    SendCodeToPhone(phone:string){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/phone_validations.json',JSON.stringify({phone:phone}))
        );
    }
    
    ReSendCodeToPhone(phone:string){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/phone_validations/resend.json',JSON.stringify({phone:phone}))
        );
    }

    SendRequestCode(phone:string,code:string){
        let params={
            phone: phone,
            code: code
        }
        return this.http.CommonRequest(
            ()=> this.http.PatchData('/phone_validations.json',JSON.stringify(params))
        );
    }

    GetAllPhoneCodesWithFormat(){
        return [
            {
            "name":"Afghanistan (‫افغانستان‬‎)",
            "iso2":"af",
            "dial_code":"93",
            "format":"+..-..-...-....",
            "priority":0
            },
            
            {
            "name":"Albania (Shqipëri)",
            "iso2":"al",
            "dial_code":"355",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Algeria (‫الجزائر‬‎)",
            "iso2":"dz",
            "dial_code":"213",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"American Samoa",
            "iso2":"as",
            "dial_code":"1684",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Andorra",
            "iso2":"ad",
            "dial_code":"376",
            "format":"+...-...-...",
            "priority":0
            },
            
            {
            "name":"Angola",
            "iso2":"ao",
            "dial_code":"244",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Anguilla",
            "iso2":"ai",
            "dial_code":"1264",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Antigua and Barbuda",
            "iso2":"ag",
            "dial_code":"1268",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Argentina",
            "iso2":"ar",
            "dial_code":"54",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Armenia (Հայաստան)",
            "iso2":"am",
            "dial_code":"374",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Aruba",
            "iso2":"aw",
            "dial_code":"297",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Australia",
            "iso2":"au",
            "dial_code":"61",
            "format":"+.. ... ... ...",
            "priority":0
            },
            
            {
            "name":"Austria (Österreich)",
            "iso2":"at",
            "dial_code":"43",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Azerbaijan (Azərbaycan)",
            "iso2":"az",
            "dial_code":"994",
            "format":"+...-..-...-..-..",
            "priority":0
            },
            
            {
            "name":"Bahamas",
            "iso2":"bs",
            "dial_code":"1242",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Bahrain (‫البحرين‬‎)",
            "iso2":"bh",
            "dial_code":"973",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Bangladesh (বাংলাদেশ)",
            "iso2":"bd",
            "dial_code":"880",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Barbados",
            "iso2":"bb",
            "dial_code":"1246",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Belarus (Беларусь)",
            "iso2":"by",
            "dial_code":"375",
            "format":"+...(..)...-..-..",
            "priority":0
            },
            
            {
            "name":"Belgium (België)",
            "iso2":"be",
            "dial_code":"32",
            "format":"+.. ... .. .. ..",
            "priority":0
            },
            
            {
            "name":"Belize",
            "iso2":"bz",
            "dial_code":"501",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Benin (Bénin)",
            "iso2":"bj",
            "dial_code":"229",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Bermuda",
            "iso2":"bm",
            "dial_code":"1441",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Bhutan (འབྲུག)",
            "iso2":"bt",
            "dial_code":"975",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"Bolivia",
            "iso2":"bo",
            "dial_code":"591",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Bosnia and Herzegovina (Босна и Херцеговина)",
            "iso2":"ba",
            "dial_code":"387",
            "format":"+...-..-....",
            "priority":0
            },
            
            {
            "name":"Botswana",
            "iso2":"bw",
            "dial_code":"267",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Brazil (Brasil)",
            "iso2":"br",
            "dial_code":"55",
            "format":"+..-..-....-....",
            "priority":0
            },
            
            {
            "name":"British Indian Ocean Territory",
            "iso2":"io",
            "dial_code":"246",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"British Virgin Islands",
            "iso2":"vg",
            "dial_code":"1284",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Brunei",
            "iso2":"bn",
            "dial_code":"673",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Bulgaria (България)",
            "iso2":"bg",
            "dial_code":"359",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Burkina Faso",
            "iso2":"bf",
            "dial_code":"226",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Burundi (Uburundi)",
            "iso2":"bi",
            "dial_code":"257",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Cambodia (កម្ពុជា)",
            "iso2":"kh",
            "dial_code":"855",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Cameroon (Cameroun)",
            "iso2":"cm",
            "dial_code":"237",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Canada",
            "iso2":"ca",
            "dial_code":"1",
            "format":"+. (...) ...-....",
            "priority":1
            },
            
            {
            "name":"Cape Verde (Kabu Verdi)",
            "iso2":"cv",
            "dial_code":"238",
            "format":"+...(...)..-..",
            "priority":0
            },
            
            {
            "name":"Caribbean Netherlands",
            "iso2":"bq",
            "dial_code":"599",
            "format":"+...-...-....",
            "priority":1
            },
            
            {
            "name":"Cayman Islands",
            "iso2":"ky",
            "dial_code":"1345",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Central African Republic (République centrafricaine)",
            "iso2":"cf",
            "dial_code":"236",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Chad (Tchad)",
            "iso2":"td",
            "dial_code":"235",
            "format":"+...-..-..-..-..",
            "priority":0
            },
            
            {
            "name":"Chile",
            "iso2":"cl",
            "dial_code":"56",
            "format":"+..-.-....-....",
            "priority":0
            },
            
            {
            "name":"China (中国)",
            "iso2":"cn",
            "dial_code":"86",
            "format":"+.. ..-........",
            "priority":0
            },
            
            {
            "name":"Colombia",
            "iso2":"co",
            "dial_code":"57",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Comoros (‫جزر القمر‬‎)",
            "iso2":"km",
            "dial_code":"269",
            "format":"+...-..-.....",
            "priority":0
            },
            
            {
            "name":"Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
            "iso2":"cd",
            "dial_code":"243",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Congo (Republic) (Congo-Brazzaville)",
            "iso2":"cg",
            "dial_code":"242",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Cook Islands",
            "iso2":"ck",
            "dial_code":"682",
            "format":"+...-..-...",
            "priority":0
            },
            
            {
            "name":"Costa Rica",
            "iso2":"cr",
            "dial_code":"506",
            "format":"+... ....-....",
            "priority":0
            },
            
            {
            "name":"Côte d’Ivoire",
            "iso2":"ci",
            "dial_code":"225",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Croatia (Hrvatska)",
            "iso2":"hr",
            "dial_code":"385",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Cuba",
            "iso2":"cu",
            "dial_code":"53",
            "format":"+..-.-...-....",
            "priority":0
            },
            
            {
            "name":"Curaçao",
            "iso2":"cw",
            "dial_code":"599",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Cyprus (Κύπρος)",
            "iso2":"cy",
            "dial_code":"357",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Czech Republic (Česká republika)",
            "iso2":"cz",
            "dial_code":"420",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Denmark (Danmark)",
            "iso2":"dk",
            "dial_code":"45",
            "format":"+.. .. .. .. ..",
            "priority":0
            },
            
            {
            "name":"Djibouti",
            "iso2":"dj",
            "dial_code":"253",
            "format":"+...-..-..-..-..",
            "priority":0
            },
            
            {
            "name":"Dominica",
            "iso2":"dm",
            "dial_code":"1767",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Dominican Republic (República Dominicana)",
            "iso2":"do",
            "dial_code":"1",
            "format":"+.(...)...-....",
            "priority":2
            },
            
            {
            "name":"Ecuador",
            "iso2":"ec",
            "dial_code":"593",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Egypt (‫مصر‬‎)",
            "iso2":"eg",
            "dial_code":"20",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"El Salvador",
            "iso2":"sv",
            "dial_code":"503",
            "format":"+... ....-....",
            "priority":0
            },
            
            {
            "name":"Equatorial Guinea (Guinea Ecuatorial)",
            "iso2":"gq",
            "dial_code":"240",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Eritrea",
            "iso2":"er",
            "dial_code":"291",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"Estonia (Eesti)",
            "iso2":"ee",
            "dial_code":"372",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Ethiopia",
            "iso2":"et",
            "dial_code":"251",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Falkland Islands (Islas Malvinas)",
            "iso2":"fk",
            "dial_code":"500",
            "format":"+...-.....",
            "priority":0
            },
            
            {
            "name":"Faroe Islands (Føroyar)",
            "iso2":"fo",
            "dial_code":"298",
            "format":"+...-...-...",
            "priority":0
            },
            
            {
            "name":"Fiji",
            "iso2":"fj",
            "dial_code":"679",
            "format":"+...-..-.....",
            "priority":0
            },
            
            {
            "name":"Finland (Suomi)",
            "iso2":"fi",
            "dial_code":"358",
            "format":"+... .. .... ....",
            "priority":0
            },
            
            {
            "name":"France",
            "iso2":"fr",
            "dial_code":"33",
            "format":"+.. . .. .. .. ..",
            "priority":0
            },
            
            {
            "name":"French Guiana (Guyane française)",
            "iso2":"gf",
            "dial_code":"594",
            "format":"+...-.....-....",
            "priority":0
            },
            
            {
            "name":"French Polynesia (Polynésie française)",
            "iso2":"pf",
            "dial_code":"689",
            "format":"+...-..-..-..",
            "priority":0
            },
            
            {
            "name":"Gabon",
            "iso2":"ga",
            "dial_code":"241",
            "format":"+...-.-..-..-..",
            "priority":0
            },
            
            {
            "name":"Gambia",
            "iso2":"gm",
            "dial_code":"220",
            "format":"+...(...)..-..",
            "priority":0
            },
            
            {
            "name":"Georgia (საქართველო)",
            "iso2":"ge",
            "dial_code":"995",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Germany (Deutschland)",
            "iso2":"de",
            "dial_code":"49",
            "format":"+.. ... .......",
            "priority":0
            },
            
            {
            "name":"Ghana (Gaana)",
            "iso2":"gh",
            "dial_code":"233",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Gibraltar",
            "iso2":"gi",
            "dial_code":"350",
            "format":"+...-...-.....",
            "priority":0
            },
            
            {
            "name":"Greece (Ελλάδα)",
            "iso2":"gr",
            "dial_code":"30",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Greenland (Kalaallit Nunaat)",
            "iso2":"gl",
            "dial_code":"299",
            "format":"+...-..-..-..",
            "priority":0
            },
            
            {
            "name":"Grenada",
            "iso2":"gd",
            "dial_code":"1473",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Guadeloupe",
            "iso2":"gp",
            "dial_code":"590",
            "format":"",
            "priority":0
            },
            
            {
            "name":"Guam",
            "iso2":"gu",
            "dial_code":"1671",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Guatemala",
            "iso2":"gt",
            "dial_code":"502",
            "format":"+... ....-....",
            "priority":0
            },
            
            {
            "name":"Guinea (Guinée)",
            "iso2":"gn",
            "dial_code":"224",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Guinea-Bissau (Guiné Bissau)",
            "iso2":"gw",
            "dial_code":"245",
            "format":"+...-.-......",
            "priority":0
            },
            
            {
            "name":"Guyana",
            "iso2":"gy",
            "dial_code":"592",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Haiti",
            "iso2":"ht",
            "dial_code":"509",
            "format":"+... ....-....",
            "priority":0
            },
            
            {
            "name":"Honduras",
            "iso2":"hn",
            "dial_code":"504",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Hong Kong (香港)",
            "iso2":"hk",
            "dial_code":"852",
            "format":"+... .... ....",
            "priority":0
            },
            
            {
            "name":"Hungary (Magyarország)",
            "iso2":"hu",
            "dial_code":"36",
            "format":"+..(...)...-...",
            "priority":0
            },
            
            {
            "name":"Iceland (Ísland)",
            "iso2":"is",
            "dial_code":"354",
            "format":"+... ... ....",
            "priority":0
            },
            
            {
            "name":"India (भारत)",
            "iso2":"in",
            "dial_code":"91",
            "format":"+.. .....-.....",
            "priority":0
            },
            
            {
            "name":"Indonesia",
            "iso2":"id",
            "dial_code":"62",
            "format":"+..-..-...-..",
            "priority":0
            },
            
            {
            "name":"Iran (‫ایران‬‎)",
            "iso2":"ir",
            "dial_code":"98",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Iraq (‫العراق‬‎)",
            "iso2":"iq",
            "dial_code":"964",
            "format":"+...(...)...-....",
            "priority":0
            },
            
            {
            "name":"Ireland",
            "iso2":"ie",
            "dial_code":"353",
            "format":"+... .. .......",
            "priority":0
            },
            
            {
            "name":"Israel (‫ישראל‬‎)",
            "iso2":"il",
            "dial_code":"972",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Italy (Italia)",
            "iso2":"it",
            "dial_code":"39",
            "format":"+.. ... ......",
            "priority":0
            },
            
            {
            "name":"Jamaica",
            "iso2":"jm",
            "dial_code":"1876",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Japan (日本)",
            "iso2":"jp",
            "dial_code":"81",
            "format":"+.. ... .. ....",
            "priority":0
            },
            
            {
            "name":"Jordan (‫الأردن‬‎)",
            "iso2":"jo",
            "dial_code":"962",
            "format":"+...-.-....-....",
            "priority":0
            },
            
            {
            "name":"Kazakhstan (Казахстан)",
            "iso2":"kz",
            "dial_code":"7",
            "format":"+. ... ...-..-..",
            "priority":1
            },
            
            {
            "name":"Kenya",
            "iso2":"ke",
            "dial_code":"254",
            "format":"+...-...-......",
            "priority":0
            },
            
            {
            "name":"Kiribati",
            "iso2":"ki",
            "dial_code":"686",
            "format":"+...-..-...",
            "priority":0
            },
            
            {
            "name":"Kuwait (‫الكويت‬‎)",
            "iso2":"kw",
            "dial_code":"965",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Kyrgyzstan (Кыргызстан)",
            "iso2":"kg",
            "dial_code":"996",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Laos (ລາວ)",
            "iso2":"la",
            "dial_code":"856",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Latvia (Latvija)",
            "iso2":"lv",
            "dial_code":"371",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Lebanon (‫لبنان‬‎)",
            "iso2":"lb",
            "dial_code":"961",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"Lesotho",
            "iso2":"ls",
            "dial_code":"266",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Liberia",
            "iso2":"lr",
            "dial_code":"231",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Libya (‫ليبيا‬‎)",
            "iso2":"ly",
            "dial_code":"218",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Liechtenstein",
            "iso2":"li",
            "dial_code":"423",
            "format":"+...(...)...-....",
            "priority":0
            },
            
            {
            "name":"Lithuania (Lietuva)",
            "iso2":"lt",
            "dial_code":"370",
            "format":"+...(...)..-...",
            "priority":0
            },
            
            {
            "name":"Luxembourg",
            "iso2":"lu",
            "dial_code":"352",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Macau (澳門)",
            "iso2":"mo",
            "dial_code":"853",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Macedonia (FYROM) (Македонија)",
            "iso2":"mk",
            "dial_code":"389",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Madagascar (Madagasikara)",
            "iso2":"mg",
            "dial_code":"261",
            "format":"+...-..-..-.....",
            "priority":0
            },
            
            {
            "name":"Malawi",
            "iso2":"mw",
            "dial_code":"265",
            "format":"+...-.-....-....",
            "priority":0
            },
            
            {
            "name":"Malaysia",
            "iso2":"my",
            "dial_code":"60",
            "format":"+.. ..-....-....",
            "priority":0
            },
            
            {
            "name":"Maldives",
            "iso2":"mv",
            "dial_code":"960",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Mali",
            "iso2":"ml",
            "dial_code":"223",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Malta",
            "iso2":"mt",
            "dial_code":"356",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Marshall Islands",
            "iso2":"mh",
            "dial_code":"692",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Martinique",
            "iso2":"mq",
            "dial_code":"596",
            "format":"+...(...)..-..-..",
            "priority":0
            },
            
            {
            "name":"Mauritania (‫موريتانيا‬‎)",
            "iso2":"mr",
            "dial_code":"222",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Mauritius (Moris)",
            "iso2":"mu",
            "dial_code":"230",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Mexico (México)",
            "iso2":"mx",
            "dial_code":"52",
            "format":"+..-..-..-....",
            "priority":0
            },
            
            {
            "name":"Micronesia",
            "iso2":"fm",
            "dial_code":"691",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Moldova (Republica Moldova)",
            "iso2":"md",
            "dial_code":"373",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Monaco",
            "iso2":"mc",
            "dial_code":"377",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Mongolia (Монгол)",
            "iso2":"mn",
            "dial_code":"976",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Montenegro (Crna Gora)",
            "iso2":"me",
            "dial_code":"382",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Montserrat",
            "iso2":"ms",
            "dial_code":"1664",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Morocco (‫المغرب‬‎)",
            "iso2":"ma",
            "dial_code":"212",
            "format":"+...-..-....-...",
            "priority":0
            },
            
            {
            "name":"Mozambique (Moçambique)",
            "iso2":"mz",
            "dial_code":"258",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Myanmar (Burma) (မြန်မာ)",
            "iso2":"mm",
            "dial_code":"95",
            "format":"+..-...-...",
            "priority":0
            },
            
            {
            "name":"Namibia (Namibië)",
            "iso2":"na",
            "dial_code":"264",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Nauru",
            "iso2":"nr",
            "dial_code":"674",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Nepal (नेपाल)",
            "iso2":"np",
            "dial_code":"977",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Netherlands (Nederland)",
            "iso2":"nl",
            "dial_code":"31",
            "format":"+.. .. ........",
            "priority":0
            },
            
            {
            "name":"New Caledonia (Nouvelle-Calédonie)",
            "iso2":"nc",
            "dial_code":"687",
            "format":"+...-..-....",
            "priority":0
            },
            
            {
            "name":"New Zealand",
            "iso2":"nz",
            "dial_code":"64",
            "format":"+.. ...-...-....",
            "priority":0
            },
            
            {
            "name":"Nicaragua",
            "iso2":"ni",
            "dial_code":"505",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Niger (Nijar)",
            "iso2":"ne",
            "dial_code":"227",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Nigeria",
            "iso2":"ng",
            "dial_code":"234",
            "format":"+...-..-...-..",
            "priority":0
            },
            
            {
            "name":"Niue",
            "iso2":"nu",
            "dial_code":"683",
            "format":"+...-....",
            "priority":0
            },
            
            {
            "name":"Norfolk Island",
            "iso2":"nf",
            "dial_code":"672",
            "format":"+...-...-...",
            "priority":0
            },
            
            {
            "name":"North Korea (조선 민주주의 인민 공화국)",
            "iso2":"kp",
            "dial_code":"850",
            "format":"+...-...-...",
            "priority":0
            },
            
            {
            "name":"Northern Mariana Islands",
            "iso2":"mp",
            "dial_code":"1670",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Norway (Norge)",
            "iso2":"no",
            "dial_code":"47",
            "format":"+.. ... .. ...",
            "priority":0
            },
            
            {
            "name":"Oman (‫عُمان‬‎)",
            "iso2":"om",
            "dial_code":"968",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Pakistan (‫پاکستان‬‎)",
            "iso2":"pk",
            "dial_code":"92",
            "format":"+.. ...-.......",
            "priority":0
            },
            
            {
            "name":"Palau",
            "iso2":"pw",
            "dial_code":"680",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Palestine (‫فلسطين‬‎)",
            "iso2":"ps",
            "dial_code":"970",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Panama (Panamá)",
            "iso2":"pa",
            "dial_code":"507",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Papua New Guinea",
            "iso2":"pg",
            "dial_code":"675",
            "format":"+...(...)..-...",
            "priority":0
            },
            
            {
            "name":"Paraguay",
            "iso2":"py",
            "dial_code":"595",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Peru (Perú)",
            "iso2":"pe",
            "dial_code":"51",
            "format":"+..(...)...-...",
            "priority":0
            },
            
            {
            "name":"Philippines",
            "iso2":"ph",
            "dial_code":"63",
            "format":"+.. ... ....",
            "priority":0
            },
            
            {
            "name":"Poland (Polska)",
            "iso2":"pl",
            "dial_code":"48",
            "format":"+.. ...-...-...",
            "priority":0
            },
            
            {
            "name":"Portugal",
            "iso2":"pt",
            "dial_code":"351",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Puerto Rico",
            "iso2":"pr",
            "dial_code":"1",
            "format":"+. (...) ...-....",
            "priority":3
            },
            
            {
            "name":"Qatar (‫قطر‬‎)",
            "iso2":"qa",
            "dial_code":"974",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Réunion (La Réunion)",
            "iso2":"re",
            "dial_code":"262",
            "format":"+...-.....-....",
            "priority":0
            },
            
            {
            "name":"Romania (România)",
            "iso2":"ro",
            "dial_code":"40",
            "format":"+..-..-...-....",
            "priority":0
            },
            
            {
            "name":"Russia (Россия)",
            "iso2":"ru",
            "dial_code":"7",
            "format":"+. ... ...-..-..",
            "priority":0
            },
            
            {
            "name":"Rwanda",
            "iso2":"rw",
            "dial_code":"250",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Saint Barthélemy (Saint-Barthélemy)",
            "iso2":"bl",
            "dial_code":"590",
            "format":"",
            "priority":1
            },
            
            {
            "name":"Saint Helena",
            "iso2":"sh",
            "dial_code":"290",
            "priority":0
            },
            
            {
            "name":"Saint Kitts and Nevis",
            "iso2":"kn",
            "dial_code":"1869",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Saint Lucia",
            "iso2":"lc",
            "dial_code":"1758",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Saint Martin (Saint-Martin (partie française))",
            "iso2":"mf",
            "dial_code":"590",
            "format":"",
            "priority":2
            },
            
            {
            "name":"Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
            "iso2":"pm",
            "dial_code":"508",
            "priority":0
            },
            
            {
            "name":"Saint Vincent and the Grenadines",
            "iso2":"vc",
            "dial_code":"1784",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Samoa",
            "iso2":"ws",
            "dial_code":"685",
            "format":"+...-..-....",
            "priority":0
            },
            
            {
            "name":"San Marino",
            "iso2":"sm",
            "dial_code":"378",
            "format":"+...-....-......",
            "priority":0
            },
            
            {
            "name":"São Tomé and Príncipe (São Tomé e Príncipe)",
            "iso2":"st",
            "dial_code":"239",
            "format":"+...-..-.....",
            "priority":0
            },
            
            {
            "name":"Saudi Arabia (‫المملكة العربية السعودية‬‎)",
            "iso2":"sa",
            "dial_code":"966",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Senegal (Sénégal)",
            "iso2":"sn",
            "dial_code":"221",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Serbia (Србија)",
            "iso2":"rs",
            "dial_code":"381",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Seychelles",
            "iso2":"sc",
            "dial_code":"248",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"Sierra Leone",
            "iso2":"sl",
            "dial_code":"232",
            "format":"+...-..-......",
            "priority":0
            },
            
            {
            "name":"Singapore",
            "iso2":"sg",
            "dial_code":"65",
            "format":"+.. ....-....",
            "priority":0
            },
            
            {
            "name":"Sint Maarten",
            "iso2":"sx",
            "dial_code":"1721",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Slovakia (Slovensko)",
            "iso2":"sk",
            "dial_code":"421",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Slovenia (Slovenija)",
            "iso2":"si",
            "dial_code":"386",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Solomon Islands",
            "iso2":"sb",
            "dial_code":"677",
            "format":"+...-.....",
            "priority":0
            },
            
            {
            "name":"Somalia (Soomaaliya)",
            "iso2":"so",
            "dial_code":"252",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"South Africa",
            "iso2":"za",
            "dial_code":"27",
            "format":"+..-..-...-....",
            "priority":0
            },
            
            {
            "name":"South Korea (대한민국)",
            "iso2":"kr",
            "dial_code":"82",
            "format":"+..-..-...-....",
            "priority":0
            },
            
            {
            "name":"South Sudan (‫جنوب السودان‬‎)",
            "iso2":"ss",
            "dial_code":"211",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Spain (España)",
            "iso2":"es",
            "dial_code":"34",
            "format":"+.. ... ... ...",
            "priority":0
            },
            
            {
            "name":"Sri Lanka (ශ්‍රී ලංකාව)",
            "iso2":"lk",
            "dial_code":"94",
            "format":"+..-..-...-....",
            "priority":0
            },
            
            {
            "name":"Sudan (‫السودان‬‎)",
            "iso2":"sd",
            "dial_code":"249",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Suriname",
            "iso2":"sr",
            "dial_code":"597",
            "format":"+...-...-...",
            "priority":0
            },
            
            {
            "name":"Swaziland",
            "iso2":"sz",
            "dial_code":"268",
            "format":"+...-..-..-....",
            "priority":0
            },
            
            {
            "name":"Sweden (Sverige)",
            "iso2":"se",
            "dial_code":"46",
            "format":"+.. .. ... .. ..",
            "priority":0
            },
            
            {
            "name":"Switzerland (Schweiz)",
            "iso2":"ch",
            "dial_code":"41",
            "format":"+.. .. ... .. ..",
            "priority":0
            },
            
            {
            "name":"Syria (‫سوريا‬‎)",
            "iso2":"sy",
            "dial_code":"963",
            "format":"+...-..-....-...",
            "priority":0
            },
            
            {
            "name":"Taiwan (台灣)",
            "iso2":"tw",
            "dial_code":"886",
            "format":"+...-....-....",
            "priority":0
            },
            
            {
            "name":"Tajikistan",
            "iso2":"tj",
            "dial_code":"992",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Tanzania",
            "iso2":"tz",
            "dial_code":"255",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Thailand (ไทย)",
            "iso2":"th",
            "dial_code":"66",
            "format":"+..-..-...-...",
            "priority":0
            },
            
            {
            "name":"Timor-Leste",
            "iso2":"tl",
            "dial_code":"670",
            "format":"+...-...-....",
            "priority":0
            },
            
            {
            "name":"Togo",
            "iso2":"tg",
            "dial_code":"228",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Tokelau",
            "iso2":"tk",
            "dial_code":"690",
            "format":"+...-....",
            "priority":0
            },
            
            {
            "name":"Tonga",
            "iso2":"to",
            "dial_code":"676",
            "format":"+...-.....",
            "priority":0
            },
            
            {
            "name":"Trinidad and Tobago",
            "iso2":"tt",
            "dial_code":"1868",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Tunisia (‫تونس‬‎)",
            "iso2":"tn",
            "dial_code":"216",
            "format":"+...-..-...-...",
            "priority":0
            },
            
            {
            "name":"Turkey (Türkiye)",
            "iso2":"tr",
            "dial_code":"90",
            "format":"+.. ... ... .. ..",
            "priority":0
            },
            
            {
            "name":"Turkmenistan",
            "iso2":"tm",
            "dial_code":"993",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"Turks and Caicos Islands",
            "iso2":"tc",
            "dial_code":"1649",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Tuvalu",
            "iso2":"tv",
            "dial_code":"688",
            "format":"+...-.....",
            "priority":0
            },
            
            {
            "name":"U.S. Virgin Islands",
            "iso2":"vi",
            "dial_code":"1340",
            "format":"+.(...)...-....",
            "priority":0
            },
            
            {
            "name":"Uganda",
            "iso2":"ug",
            "dial_code":"256",
            "format":"+...(...)...-...",
            "priority":0
            },
            
            {
            "name":"Ukraine (Україна)",
            "iso2":"ua",
            "dial_code":"380",
            "format":"+...(..)...-..-..",
            "priority":0
            },
            
            {
            "name":"United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
            "iso2":"ae",
            "dial_code":"971",
            "format":"+...-.-...-....",
            "priority":0
            },
            
            {
            "name":"United Kingdom",
            "iso2":"gb",
            "dial_code":"44",
            "format":"+.. .... ......",
            "priority":0
            },
            
            {
            "name":"United States",
            "iso2":"us",
            "dial_code":"1",
            "format":"+. (...) ...-....",
            "priority":0
            },
            
            {
            "name":"Uruguay",
            "iso2":"uy",
            "dial_code":"598",
            "format":"+...-.-...-..-..",
            "priority":0
            },
            
            {
            "name":"Uzbekistan (Oʻzbekiston)",
            "iso2":"uz",
            "dial_code":"998",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Vanuatu",
            "iso2":"vu",
            "dial_code":"678",
            "format":"+...-.....",
            "priority":0
            },
            
            {
            "name":"Vatican City (Città del Vaticano)",
            "iso2":"va",
            "dial_code":"39",
            "format":"+.. .. .... ....",
            "priority":1
            },
            
            {
            "name":"Venezuela",
            "iso2":"ve",
            "dial_code":"58",
            "format":"+..(...)...-....",
            "priority":0
            },
            
            {
            "name":"Vietnam (Việt Nam)",
            "iso2":"vn",
            "dial_code":"84",
            "format":"+..-..-....-...",
            "priority":0
            },
            
            {
            "name":"Wallis and Futuna",
            "iso2":"wf",
            "dial_code":"681",
            "format":"+...-..-....",
            "priority":0
            },
            
            {
            "name":"Yemen (‫اليمن‬‎)",
            "iso2":"ye",
            "dial_code":"967",
            "format":"+...-.-...-...",
            "priority":0
            },
            
            {
            "name":"Zambia",
            "iso2":"zm",
            "dial_code":"260",
            "format":"+...-..-...-....",
            "priority":0
            },
            
            {
            "name":"Zimbabwe",
            "iso2":"zw",
            "dial_code":"263",
            "format":"+...-.-......",
            "priority":0
            }];
    }



}