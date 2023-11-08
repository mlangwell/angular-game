import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewContainerRef, inject } from '@angular/core';
import { TargetComponent } from '../target/target.component';
import { Observable, Subject, map, take, takeUntil, timer } from 'rxjs';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Point } from '../interfaces/point';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements AfterViewInit, OnDestroy, OnInit {
  vcr: ViewContainerRef = inject(ViewContainerRef);
  subject: Subject<boolean> = new Subject();
  score: number = 0;
  roundTimer$: Observable<number> = timer(3250, 1000).pipe(map((value) => (value - 30) * -1));
  spawnTimer$: Observable<number> = timer(3250, 250);
  countdown$: Observable<number> = timer(250, 1000).pipe(map(x => 3 - x), take(4));
  accuracy!: number;
  targetCount: number = 0;
  startHeight!: number;
  startWidth!: number;
  targetSize: number = 100
  toolbarSize: number = 80;
  existingLocations: Array<Point> = new Array<Point>();

  constructor(private _appService: AppService, private _router: Router, private _el: ElementRef) {
  }

  ngOnInit(): void {
    // remove targets from the existing locations when they are removed from the DOM
    this._appService.removedLocation$.pipe(takeUntil(this.subject)).subscribe(removedLocation => {
      this.existingLocations = this.existingLocations.filter(location => location.x !== removedLocation.x && location.y !== removedLocation.y);
      // console.log('locations number:', this.existingLocations.length);
    });
    this._appService.scoreSub$.pipe(takeUntil(this.subject)).subscribe((value: number) => this.score = value);
    this._appService.accuracySub$.pipe(takeUntil(this.subject)).subscribe((value: number) => this.accuracy = value);
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
      let newPos!: Point;

      let isSpawnable: boolean = false;
      while (!isSpawnable) {
        newPos = this.calculatePosition();
        //console.log(`determinig existance`, newPos);
        isSpawnable = !this.determineExistance(newPos, this.existingLocations);
        //console.log(`determinig spawnable`, isSpawnable);
      }

      const compRef = this.vcr.createComponent(TargetComponent);
      compRef.instance.location = newPos;
      this.existingLocations.push(newPos);
      compRef.location.nativeElement.style.left = `${newPos.x}px`;
      compRef.location.nativeElement.style.top = `${newPos.y}px`;
      compRef.changeDetectorRef.detectChanges();
    });
  }

  calculatePosition(): Point {
    const left = Math.ceil(Math.random() * this.startWidth);
    const top = Math.ceil((Math.random() * this.startHeight) + this.toolbarSize);
    return { x: left, y: top };
  }

  determineExistance(newPos: Point, existingLocations: Array<Point>): boolean {
    let alreadyExists: boolean = false;

    //iterate over existing locations
    for (let i = 0; i < existingLocations.length; i++) {
      // check whether the existing locations y already exists in the range
      let doesYExist: boolean = this.checkExistanceInRange(existingLocations[i].y, newPos.y, 25);

      if (doesYExist) {
        alreadyExists = true;
        break;
      }
    }

    return alreadyExists;
  }

  checkExistanceInRange(curr: number, newNum: number, targetSize: number): boolean {
    const rangeArray: Array<number> = new Array<number>();
    // insert all numbers before current number by target size
    for (let i = curr - targetSize; i <= curr; i++) {
      rangeArray.push(i);
    }

    // insert all numbers after current number by target size
    for (let i = curr + targetSize; i > curr; i--) {
      rangeArray.push(i);
    }
    return rangeArray.indexOf(newNum) > -1;
  }
}
