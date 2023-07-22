'use strict';

window.addEventListener('DOMContentLoaded', ()=> {

	//Tabs
		const tabs = document.querySelectorAll('.tabheader__item');
		const tabsContent = document.querySelectorAll('.tabcontent');
		const tabsParent = document.querySelector('.tabheader__items');

		function hideTabContent() {
			tabsContent.forEach(item => {
				item.classList.add('hide');
				item.classList.remove('show', 'fade');
			});
			tabs.forEach(item => {
				item.classList.remove('tabheader__item_active')
			})
		}

		function showTabContent (i = 0){
			tabsContent[i].classList.add('show', 'fade');
			tabsContent[i].classList.remove('hide');
			tabs[i].classList.add('tabheader__item_active');
		}

		hideTabContent();
		showTabContent()

		tabsParent.addEventListener('click', (event) => {
			const target = event.target;

			if(target && target.classList.contains('tabheader__item')){
				tabs.forEach((item, i) => {
					if(target === item){
						hideTabContent();
						showTabContent(i)
					}
				})
			}
		})

		//Timer
		const deadline = '2023-07-25';

		function getTimeRamaining(endtime){
			let days;
			let hours;
			let minutes;
			let seconds;
			const t = Date.parse(endtime) - Date.parse(new Date());
			if(t <= 0){
				days = 0;
				hours = 0;
				minutes = 0;
				seconds = 0;
			} else {
				days = Math.floor(t / (1000 * 60 * 60 * 24));
				hours = Math.floor((t / (1000 * 60 * 60) % 24));
				minutes = Math.floor((t / 1000 / 60) % 60);
				seconds = Math.floor((t / 1000) % 60);
			}


			return {
				'total': t,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};
		};

		function getZiro(num){
			if(num >= 0 && num < 10){
				return `0${num}`
			} else {
				return num
			}
		}

		function setClock(selector, endtime){
			const timer = document.querySelector(selector);
			const days = timer.querySelector('#days');
			const hours = timer.querySelector('#hours');
			const minutes = timer.querySelector('#minutes');
			const seconds = timer.querySelector('#seconds');
			const timeInterval = setInterval(updateClock, 1000);

			updateClock()

			function updateClock(){
				const t = getTimeRamaining(endtime);

				days.innerHTML = getZiro(t.days);
				hours.innerHTML = getZiro(t.hours);
				minutes.innerHTML = getZiro(t.minutes);
				seconds.innerHTML = getZiro(t.seconds);

				if( t.total <= 0){
					clearInterval(timeInterval)
				};
			};
		};

		setClock('.timer', deadline)


		//Modal

		const modalTrigger = document.querySelectorAll('[data-modal]');
		const modal = document.querySelector('.modal');
		

		function openModal (){
			modal.classList.add('show');
			modal.classList.remove('hide');
			document.body.style.overflow = 'hidden';

			clearInterval(modalTimerId);
		}

		function closeModal (){
			modal.classList.add('hide');
			modal.classList.remove('show');
			document.body.style.overflow = '';
		}

		modalTrigger.forEach(btn => {
			btn.addEventListener('click', openModal)
		})

		modal.addEventListener('click', (event) => {
			if(event.target === modal || event.target.getAttribute("data-close") == ''){
				closeModal()
			}
		})

		document.addEventListener('keydown', (event) => {
			if(event.code === 'Escape' && modal.classList.contains('show')){
				closeModal()
			}
		});

		const modalTimerId = setTimeout(openModal, 50000);

		function showModalByScroll(){
			if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1){
					openModal();
					window.removeEventListener('scroll', showModalByScroll)
			}
		}

		window.addEventListener('scroll', showModalByScroll)


		//Используем классы для Cards
		
		class MenuCard {
			constructor(src, alt, title, descr, price, parentSelector, ...classes){
				this.src = src;
				this.alt = alt;
				this.title = title;
				this.descr = descr;
				this.price = price;
				this.classes = classes;
				this.parentSelector = document.querySelector(parentSelector);
				this.transfer = 27;
				this.changetoUAH();
			}

			changetoUAH() {
				this.price = +this.price * this.transfer;
			}

			render() {
				const element = document.createElement('div');

				if(this.classes.length === 0){
					this.element = 'menu__item'
					element.classList.add(this.element)
				} else {
					this.classes.forEach(className => element.classList.add(className));
				}
				
				element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
          </div>
				`
				this.parentSelector.append(element)
			}
		}

		const getResource = async (url) => {
			const res = await fetch(url);

			if(!res.ok){
				throw new Error(`Could not fetch ${url}, status: ${res.status}`)
			}
			return await res.json();
		};

		getResource('http://localhost:3000/menu')
			.then((data) => {
				data.forEach(({img, altimg, title, descr, price}) => {
					new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
				});
			});

		// getResource('http://localhost:3000/menu')
		// 	.then(data => createCard(data));

		// 	function createCard (data) {
		// 		data.forEach(({img, altimg, title, descr, price}) => {
		// 			const element = document.createElement('div');
		// 			price *= 27;
		// 			element.classList.add('menu__item');

		// 			element.innerHTML = `
		// 				<img src=${img} alt=${altimg}>
		// 					<h3 class="menu__item-subtitle">${title}</h3>
		// 					<div class="menu__item-descr">${descr}</div>
		// 					<div class="menu__item-divider"></div>
		// 					<div class="menu__item-price">
		// 							<div class="menu__item-cost">Цена:</div>
		// 							<div class="menu__item-total"><span>${price}</span> руб/день</div>
		// 				</div>
		// 			`;
		// 			document.querySelector('.menu .container').append(element)
		// 		});
		// 	}

		//Forms

		const forms = document.querySelectorAll('form');

		const message = {
			loading: 'img/form/spinner.svg',
			success: 'Спасибо! Скоро мы с вами свяжемся',
			failure: 'Что-то пошло не так...'
		};

		forms.forEach(item => {
			bindPostData(item)
		});

		const postData = async (url, data) => {
			const res = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
					},
					body: data
			});
			return await res.json();
		};

		function bindPostData(form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();

				const statusMessage = document.createElement('img');
				statusMessage.src = message.loading;
				statusMessage.style.cssText = `
					display: block;
					margin: 0 auto;
				`;
				form.insertAdjacentElement('afterend', statusMessage);

				const formData = new FormData(form);

				const json = JSON.stringify(Object.fromEntries(formData.entries()));


				postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data)
						showThanksModal(message.success);
						statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				})
			});
		}

		function showThanksModal(message) {
			const prevModalDialog = document.querySelector(".modal__dialog");

			prevModalDialog.classList.add('hide');
			openModal();

			const thanksModal = document.createElement("div");
			thanksModal.classList.add("modal__dialog");
			thanksModal.innerHTML = `
				<div class="modal__content">
					<div class="modal__close" data-close></div>
					<div class="modal__title">${message}</div>
				</div>
			`;
			document.querySelector('.modal').append(thanksModal);
			setTimeout(() => {
				thanksModal.remove();
				prevModalDialog.classList.add('show');
				prevModalDialog.classList.remove('hide');
				closeModal();
			}, 4000)
		}

		fetch('http://localhost:3000/menu')
			.then(data => data.json())
			.then(res => console.log(res))
		
})