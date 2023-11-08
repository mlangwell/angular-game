import { AfterViewInit, Component, ComponentFactoryResolver, ContentChildren, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, inject } from '@angular/core';
import { TargetComponent } from '../target/target.component';
import { Observable, Subject, map, take, takeUntil, timer } from 'rxjs';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements AfterViewInit, OnDestroy, OnInit {
  vcr: ViewContainerRef = inject(ViewContainerRef);
  subject: Subject<boolean> = new Subject();
  score: number = 0;
  roundTimer$: Observable<number> = timer(3250, 1000).pipe(map((value) => (value - 30) * -1), take(30));
  spawnTimer$: Observable<number> = timer(3250, 250);
  countdown$: Observable<number> = timer(250, 1000).pipe(map(x => 3 - x), take(4));
  accuracy!: number;
  targetCount: number = 0;
  startHeight!: number;
  startWidth!: number;
  targetSize: number = 100
  toolbarSize: number = 80;

  constructor(private _appService: AppService, private _router: Router, private _el: ElementRef) {
  }

  ngOnInit(): void {
    this._appService.scoreSub$.pipe(takeUntil(this.subject)).subscribe((value: number) => this.score = value);
    this._appService.accuracySub$.pipe(takeUntil(this.subject)).subscribe((value: number) => {
      this.accuracy = value; console.log(value);
    });
    this.roundTimer$.pipe(takeUntil(this.subject)).subscribe((value: number) => {
      if (value <= 0) {
        this._router.navigate(['end']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subject.next(true);
    this.subject.unsubscribe();
  }

  ngAfterViewInit() {
    this._calculateSpace();
    this._spawn();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    this._appService.trackClick();
  }

  private _calculateSpace() {
    this.startHeight = this._el.nativeElement.offsetHeight;
    this.startWidth = this._el.nativeElement.offsetWidth;
    this.startHeight -= this.targetSize;
    this.startWidth -= this.targetSize;
  }

  private _spawn() {
    this.spawnTimer$.pipe(takeUntil(this.subject)).subscribe(() => {
      const compRef = this.vcr.createComponent(TargetComponent);
      compRef.location.nativeElement.style.top = `${(Math.random() * this.startHeight) + this.toolbarSize}px`;
      compRef.location.nativeElement.style.left = `${Math.random() * this.startWidth}px`;
      compRef.changeDetectorRef.detectChanges();
    });
  }
}
