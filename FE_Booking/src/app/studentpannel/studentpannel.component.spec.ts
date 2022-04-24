import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentpannelComponent } from './studentpannel.component';

describe('StudentpannelComponent', () => {
  let component: StudentpannelComponent;
  let fixture: ComponentFixture<StudentpannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentpannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentpannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
