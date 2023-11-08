import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Point } from './interfaces/point';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  score: number = 0;
  scoreSub$: BehaviorSubject<number> = new BehaviorSubject(0);
  clicks: number = 0;
  onTargetClicks: number = 0;
  accuracySub$: BehaviorSubject<number> = new BehaviorSubject(100);
  removedLocation$: Subject<Point> = new Subject();

  constructor() { }

  addScore() {
    this.score++;
    this.onTargetClicks++;
    this.scoreSub$.next(this.score);
    this.accuracySub$.next(this.calculateAccuracy());
  }

  trackClick() {
    this.clicks++;
    this.accuracySub$.next(this.calculateAccuracy());
  }

  calculateAccuracy(): number {
    let num = (this.onTargetClicks / this.clicks) * 100;
    return Math.round(num * 100) / 100;
  }

  reset() {
    this.score = 0;
    this.clicks = 0;
    this.onTargetClicks = 0;
    this.accuracySub$.next(100);
    this.scoreSub$.next(0);
  }

  removeTarget(location: Point): void {
    this.removedLocation$.next(location);
  }
}
