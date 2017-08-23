var MyForm = {
	values: ['fio', 'email', 'phone'],
	validDomains: ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'],

	/* 
	 * Валидация формы
	 *
	 * @return {Object} Результат проверки
	 */
	validate: function() {
		var data = this.getData(), 
			fio = data.fio.replace(/\s{2,}/g, ' ').trim(),
			email = data.email.replace(/\s*/g,''), phone = data.phone.replace(/\s*/g,''),
			response = {}, errFields = [];

		var fioLength = fio.split(' ').length;
		
		if (fioLength != 3) {
			errFields.push('fio');
		}

		if (!this.validEmail(email)) {
			errFields.push('email');
		}

		if (!this.validPhone(phone)) {
			errFields.push('phone');
		}
		
		response['errorFields'] = errFields;
		this.setErrorClass(errFields);
		if (errFields.length > 0) {
			response['isValid'] = false;
			return response;
		} else {
			response['isValid'] = true;
			return response;
		}

	},

	/* 
	 * Получает значения полей формы
	 *
	 * @return {Object}
	 */
	getData: function() {
		var allFields = this.values, dataObject = {};
		for (var i = 0; i < allFields.length; i++){
			var field = document.querySelector('[name=' + allFields[i] + ']');
			dataObject[allFields[i]] = field.value;
		}
		return dataObject;
	},

	/* 
	 * Устанавливает полям формы значения
	 *
	 * @param {Object} Объект с данными. Ключи == "name" поля формы. 
	 * {fio: "Иван Иванович Иванов", email: "ivan@ya.ru", phone: "+7(111)111-11-11"}
	 *
	 */
	setData: function(obj) {
		for (name in obj) {
			var field = document.querySelector('[name=' + name + ']');
			field.value = obj[name];
		}
	},

	/* 
	 * Валидация и отправка запроса при её прохождении
	 *
	 */
	submit: function() {
		var processValidation = this.validate();
		if(processValidation.isValid){
			var data = this.getData(),
				resultContainer = document.getElementById('resultContainer');
				btn = document.getElementById('submitButton'),
				action = document.getElementById('myForm').action;
				btn.disabled = true;
			fetch(action, { method: "POST", body: JSON.stringify(data), headers: {
		          'Accept': 'application/json',
		          'Content-Type': 'application/json'
		        }})
			  .then(function(response) {
			    return response.json();
			   })
			  .then(function(res) {
			  	if (res.status == 'success') {
			  		clearTimeout(MyForm.intervalId);
			    	resultContainer.innerHTML = 'Success';
			    	resultContainer.classList.add("success");
			    	btn.disabled = false;
			    } else if(res.status == 'error'){
			    	clearTimeout(MyForm.intervalId);
			    	resultContainer.innerHTML = res.reason;
			    	resultContainer.classList.add("error");
			    	btn.disabled = false;
			    } else if(res.status == 'progress'){		    			    
				    var timer;
					timer = setInterval(function() {
						MyForm.submit();
					}, res.timeout);
					MyForm.intervalId = timer;
					while (timer--) {
					    clearTimeout(timer);
					}	    	
				    return false;				       	
			    }
			    		    
			    return false;
			  })
			  .catch(function(data) {
			  	clearTimeout(MyForm.intervalId);
			    resultContainer.innerHTML = 'Не удалось отправить данные';
			    resultContainer.classList.add("error");
			    btn.disabled = false;
			  }); 
		} 
	},
	

	/* 
	 * При ошибки валидации выставлет нужным полям класс .error
	 *
	 * @param {array} Массив с именами полей не прошедшие валидацию
	 */
	setErrorClass: function(fields){
		var allFields = this.values;
		for(var i = 0; i < allFields.length; i++){
			var el = document.querySelector('[name=' + allFields[i] + ']');
			if (fields.indexOf(allFields[i]) == -1) {
				el.classList.remove("error");
			} else {
				el.classList.add("error");
			}
		}
	},

	/* 
	 * Проверка на валидность поля "E-Mail"
	 *
	 * @param {string} Значение поля 
	 * @return {boolean} Результат проверки
	 */
	validEmail: function(email){
		var rule = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
		if (!rule.test(email)) { return false; } 
		var validArray = this.validDomains, domain = email.split('@')[1];
		if (validArray.indexOf(domain) == -1) {
			return false;
		} 
		return true;
	},

	/* 
	 * Проверка на валидность поля "Телефон"
	 *
	 * @param {string} Значение поля 
	 * @return {boolean} Результат проверки
	 */
	validPhone: function(phone){
		var rule = /^(\+7)\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/; 
	    if (!rule.test(phone)) { 
	        return false; 
	    } 
	    var numArray = phone.replace(/[^0-9]/g, '').split('');
	    var sum = numArray.reduce(function(a, b){
	    	return parseInt(a) + parseInt(b);
	    });	    
	    if (sum >= 30) {
	    	return false;
	    }
	    return true;
	},

	intervalId: 0


}

/* Клик по #submitButton */

var btn = document.getElementById('submitButton');
btn.addEventListener('click', function(e) {	
	e.preventDefault();
	MyForm.submit();
});