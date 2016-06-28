import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  ComponentFixture,
  TestComponentBuilder
} from '@angular/compiler/testing';
import { provide } from '@angular/core';
import { UserService } from '../app/user-service';
import { LoginService } from '../app/login-service';
import { GreetingComponent } from '../app/greeting-component';

class MockLoginService extends LoginService {
  login(pin: number) {
    return Promise.resolve(true);
  }
}

describe('greeting component', () => {
  var builder;

  beforeEachProviders(() => [
    provide(LoginService, {useClass: MockLoginService}),
    UserService
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));

  it('should ask for registration number', async(() => {
    builder.createAsync(GreetingComponent).then((fixture: ComponentFixture<GreetingComponent>) => {
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;


      expect(compiled).toContainText('Enter registration number');
      expect(compiled.querySelector('h3')).toHaveText('Status: Enter registration number');
    });
  }));

  it('should change greeting', async(() => {
    builder.createAsync(GreetingComponent).then((fixture: ComponentFixture<GreetingComponent>) => {
      fixture.detectChanges();

      fixture.debugElement.componentInstance.greeting = 'Foobar';

      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h3')).toHaveText('Status: Foobar');
    });
  }));

  it('should override the template', async(() => {
    builder.overrideTemplate(GreetingComponent, `<span>{{greeting}}<span>`)
      .createAsync(GreetingComponent).then((fixture: ComponentFixture<GreetingComponent>) => {
          fixture.detectChanges();

          var compiled = fixture.debugElement.nativeElement;
          expect(compiled).toHaveText('Enter registration number');
        });
      }));

  it('should accept pin', async(() => {
    builder.createAsync(GreetingComponent).then((fixture: ComponentFixture<GreetingComponent>) => {
      fixture.detectChanges();
      var compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('button').click();

      fixture.debugElement.componentInstance.pending.then(() => {
        fixture.detectChanges();
        expect(compiled.querySelector('h3')).toHaveText('Status: Congratulations!');
      });
    });
  }));

  it('should accept pin (with fakeAsync)', fakeAsync(() => {
    var fixture;
    builder.createAsync(GreetingComponent).then((rootFixture) => {
      fixture = rootFixture });
    tick();

    var compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('button').click();

    tick();
    fixture.detectChanges();
    expect(compiled.querySelector('h3')).toHaveText('Status: Congratulations!');
  }));
});
