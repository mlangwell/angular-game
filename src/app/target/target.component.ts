import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent {
  @HostListener('click', ['$event.target'])
  onClick(btn: HTMLElement) {
    this._elRef.nativeElement.remove();
    this._appService.addScore();
  }

  constructor(private _appService: AppService, private _elRef: ElementRef) {
  }
}
