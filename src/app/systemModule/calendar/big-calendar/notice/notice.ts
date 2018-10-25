import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'notice-input-preview',
    templateUrl: './notice.html',
    styleUrls: ['../../../venueCreate/venueCreate.component.css']
})
export class NoticeInputComponentPreview implements OnChanges {

    @Input() Days: number;
    @Input() readonly:boolean = false;
    @Output() OnDaysChange: EventEmitter<number> = new EventEmitter();

    Num: number = 0;
    Applyer: number = 1;

    constructor()
    {
        this.Num = 1;
        this.Applyer = 1;
    }
    ngOnChanges(changes: SimpleChanges): void
    {
        if(changes && changes.Days && changes.Days.currentValue)
        {
            const num = changes.Days.currentValue;
            if(!changes.Days.previousValue)
            {
                if(num % 30 === 0)
                {
                    this.Applyer = 30;
                    this.Num = num / 30;
                }
                else if (num % 7 === 0)
                {
                    this.Applyer = 7;
                    this.Num = num / 7;
                }
                else{
                    this.Applyer = 1;
                    this.Num = num;
                }
            }
            else{
                this.Num = num / this.Applyer;
            }

        }
    }

    OnNumChange($event)
    {
        this.Num = $event;
        this.EmitNewNumber();
    }

    OnApplyerChange($event)
    {
        this.Applyer = $event;
        this.EmitNewNumber();
    }

    EmitNewNumber()
    {
        this.OnDaysChange.emit(this.Num * this.Applyer);
    }

    GetMinimumNoticeMask()
    {
        return {
        mask: [/[1-9]/,/[0-9]/,/[0-9]/],
        keepCharPositions: true,
        guide:false
        };
    }

}
