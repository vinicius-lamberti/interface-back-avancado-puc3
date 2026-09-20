import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { provideRouter } from '@angular/router';

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        provideRouter([]),
        {
          provide: OrderService,
          useValue: {
            getByUserId: () => of([]),
          },
        },
        {
          provide: UserService,
          useValue: {
            currentUser: signal({ id: 1, username: 'Teste', email: 'teste@aurora.store' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    fixture.detectChanges();
  });

  it('should render the empty state when no orders exist', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    console.log(compiled.textContent);
    expect(compiled.textContent).toContain('Você ainda não possui pedidos');
  });
});
