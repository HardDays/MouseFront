import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-analytic-card',
  templateUrl: './analytic-card.component.html',
  styleUrls: ['./analytic-card.component.css']
})
export class AnalyticCardComponent implements OnInit {

  @Input() Total = 0;
  @Input() ColorClass = '';
  @Input() TypeClass = '';
  @Input() By = '';

  @Output() onChangePeriod = new EventEmitter<string>();
  Period = 'all';

  ngOnInit(){}


  setPeriod(per:string){
    this.Period = per;
    this.onChangePeriod.emit(this.Period);
  }

  
}
