'use strict';

require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal, { openModal } from './modules/modal';
import slider from './modules/slider';
import timer from './modules/timer';
import tabs from './modules/tabs';

window.addEventListener('DOMContentLoaded', ()=> {
	const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);
		
	calc();
	cards();
	forms('form', modalTimerId);
	modal('[data-modal]', '.modal', modalTimerId);
	slider({
		container: '.offer__slider',
		slide: '.offer__slide',
		nextArrow: '.offer__slider-next',
		prewArrow: '.offer__slider-prev',
		totalCounter: '#total',
		currentCounter: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner',
	});
	timer('.timer', '2023-07-30');
	tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
})