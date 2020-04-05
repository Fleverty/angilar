/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrderProductPopupComponent } from './order-product-popup.component';

describe('OrderProductPopupComponent', () => {
	let component: OrderProductPopupComponent;
	let fixture: ComponentFixture<OrderProductPopupComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderProductPopupComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderProductPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
