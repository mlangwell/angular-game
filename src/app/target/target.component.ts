import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { take, timer } from 'rxjs';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {
  @HostListener('click', ['$event.target'])
  onClick(btn: HTMLElement) {
    this._elRef.nativeElement.remove();
    this._appService.addScore();
  }

  constructor(private _appService: AppService, private _elRef: ElementRef) {
  }

  ngOnInit(): void {
    timer(3000).pipe(take(1)).subscribe(() => this._elRef.nativeElement.remove())
  }
}
