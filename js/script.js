'use strict';

class Auth {
	constructor(form, buttons, inputName, inputLogin, inputPass, list) {
		this.form = document.querySelector(form);
		this.buttons = document.querySelector(buttons);
		this.inputName = document.getElementById(inputName);
		this.inputLogin = document.getElementById(inputLogin);
		this.inputPass = document.getElementById(inputPass);
		this.list = document.querySelector(list);
		this.usersData = new Map(JSON.parse(localStorage.getItem('UsersDataList')));
	}

	addToStorage() {
		localStorage.setItem('UsersDataList', JSON.stringify([...this.usersData]));
	}

	render() {
		this.list.textContent = '';
		this.usersData.forEach(this.createItem, this);
		this.addToStorage();
	}

	createItem(users) {
		const li = document.createElement('li');
		li.classList.add('auth-list-item');
		li.key = users.key;
		li.insertAdjacentHTML('beforeend', `
			${users.firstName} ${users.lastName}
				<button class="form-remove">Удалить</button>
		`);
		this.list.append(li);
	}

	loginUser() {

		if (this.usersData.get(this.inputLogin.value.trim()) !== undefined) {
			const thisObj = this.usersData.get(this.inputLogin.value.trim());
			if (this.inputPass.value.trim() === thisObj.pass) {
				const title = document.querySelector('.auth__title');
				title.textContent = `Добро пожаловать, ${thisObj.firstName}`;
				this.render();
				this.inputLogin.value = '';
				this.inputPass.value = '';
			} else {
				alert('Пароль не верный');
			}
		} else {
			alert('Логин не верный');
		}
	}

	addUser(e) {
		e.preventDefault();

		if (this.inputName.parentNode.style.display === 'none') {
			this.loginUser();
		} else {
			const fullName = this.inputName.value.split(' ');

			const newUser = {
				firstName: fullName[0],
				lastName: fullName[1],
				login: this.inputLogin.value,
				pass: this.inputPass.value,
				key: this.inputLogin.value, //key: this.generateKey(),
				id: this.generateKey(),
			};
			this.usersData.set(newUser.login, newUser);
			this.addToStorage();
			this.inputName.value = '';
			this.inputLogin.value = '';
			this.inputPass.value = '';
		}
	}

	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	deleteItem(elem) {
		this.usersData.delete(elem.key);
		this.render();
	}

	handler() {
		this.buttons.addEventListener('click', e => {
			e.preventDefault();
			const target = e.target;

			if (target.textContent === 'Войти') {
				this.inputName.parentNode.style.display = 'none';
				this.form.classList.add('active');
			} else if (target.textContent === 'Зарегистрироваться') {
				this.inputName.parentNode.style.display = '';
				this.form.classList.add('active');
			}
		});
		this.list.addEventListener('click', e => {
			e.preventDefault();
			const target = e.target;

			if (target.closest('.form-remove')) {
				this.deleteItem(target.closest('.auth-list-item'));
			}
		});
	}

	init() {
		this.form.addEventListener('submit', this.addUser.bind(this));
		this.handler();
	}

}


const auth = new Auth('.auth__form', '.auth__buttons', '1', '2', '3', '.auth__list');

auth.init();