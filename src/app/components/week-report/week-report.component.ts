import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from "ng2-redux";
import * as moment from 'moment';

import { AppState } from "../../app.state";
import { DatesService } from "../../services/dates.service";
import { DayReportComponent } from "../day-report/day-report.component";

@Component({
  selector: 'app-week-report',
  templateUrl: 'week-report.component.html',
  styleUrls: ['week-report.component.css']
})
export class WeekReportComponent extends DayReportComponent implements OnInit, OnDestroy {

  constructor(ngRedux: NgRedux<AppState>, ds: DatesService) {
    super(ngRedux, ds);
    this.viewToggle = 'week'
  }

  ngOnInit() {
    this.ngRedux.dispatch({type: 'SET_CURRENT_DAY'});
    this.today = moment();
    this.subscription = this.ngRedux.select('currentDate').subscribe((currentDay: moment.Moment) => {
      this.currentDay = currentDay;
      this.arrayDaysInMonth = this.ds.getMonthDays(this.currentDay.format('YYYY-MM'));
      this.arrayForTilesOfMonth = this.ds.getTilesForCalendar(this.arrayDaysInMonth);
    });
  }

  changeDate(input: string, state: string = 'week') {
    this.ngRedux.dispatch({type: 'SET_DATE', date: input});
    this.changeView(state);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
