import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCalendarEventComponent } from './default-calendar-event.component';

describe('DefaultCalendarEventComponent', () => {
  let component: DefaultCalendarEventComponent;
  let fixture: ComponentFixture<DefaultCalendarEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultCalendarEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultCalendarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
