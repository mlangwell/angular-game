import { Component, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnDestroy {
  score$ = this._appService.scoreSub$;
  accuracy$ = this._appService.accuracySub$;

  constructor(private _appService: AppService) { }

  ngOnDestroy(): void {
    this._appService.reset();
  }
}
