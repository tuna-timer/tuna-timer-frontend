import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgModel } from "@angular/forms";

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { User } from "../../models/user";
import { Timer } from "../../models/timer";
import { TimersService } from "../../services/timers.service";

@Component({
  selector: 'app-timer-form',
  templateUrl: './timer-form.component.html'
})
export class TimerFormComponent implements OnInit, OnDestroy {
  @Input() timer: Timer;
  @Input() projects: [any];
  @Input() currentUser: User;
  private subscription: Subscription;
  private fetchPeriod: number = 10000;

  constructor(private timersService: TimersService) { }

  ngOnInit() {
    if (!this.timer.finished_at) {
      let timer = TimerObservable.create(this.fetchPeriod, this.fetchPeriod);
      this.subscription = timer.subscribe();

      this.subscription = timer.subscribe(() => {
        if (!document.hidden) this.timersService.updateTimers(this.currentUser.jwt)
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription)  this.subscription.unsubscribe();
  }

  startStopClickHandler() {
    if (this.timer.finished_at) {
      this.timersService.createTimer(this.timer, this.currentUser.jwt)
    } else {
      this.timersService.stopTimer(this.timer, this.currentUser.jwt)
    }
  }

  updateTimerNameHandler(input: NgModel = null) {
    this.timersService.allowUpdate();
    if (input.pristine || input.invalid) return;
    this.timersService.updateTimer(this.timer, this.currentUser.jwt);
  }

  selectProjectHandler(name: string) {
    let project = this.projects.find(p => {return p.ext_name === name});
    this.timer.project_ext_id = project.ext_id;
    this.timer.project_id = project.id;

    this.timersService.updateTimer(this.timer, this.currentUser.jwt);
    this.timersService.allowUpdate();
  }

  disableTimersUpdate() {
    this.timersService.disableUpdate();
  }
}
