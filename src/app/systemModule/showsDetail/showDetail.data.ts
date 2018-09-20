import { Injectable } from '@angular/core';

@Injectable()
export class Data {

    public field = "tickets_store";
    public storage: any;

    public constructor() { 
        const last_state = localStorage.getItem(this.field);
        if(last_state)
        {
            this.storage = JSON.parse(last_state);
        }
        else{
            this.storage = {
                EventId: null,
                Tickets:[]
            };
        }
    }

    public SaveStorage()
    {
        localStorage.setItem(this.field, JSON.stringify(this.storage));
    }

}