import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { take, timer } from 'rxjs';
import { Point } from '../interfaces/point';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
  @Input() location!: Point;

  @HostListener('click', ['$event.target'])
  onClick(btn: HTMLElement) {
    this.remove();
    this._appService.addScore();
  }

  constructor(private _appService: AppService, private _elRef: ElementRef) {
  }

  ngOnInit(): void {
    timer(3000).pipe(take(1)).subscribe(() => this.remove())
  }

  remove(): void {
    // console.log('removing target:', this.location);

    this._appService.removeTarget(this.location);
    this._elRef.nativeElement.remove();
  }
}
