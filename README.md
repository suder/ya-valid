## ya-valid (Pure JS)

Все требования соблюдены.

`MyForm`, помимо указанных методов (`validate()/getData()/setData(Object)/submit()`), также содержит вспомогательные методы  и свойства.

- `validEmail()` - Непосредственно проверка на валидность e-mail
- `validPhone()` - ... Телефон
- `setErrorClass()` - Пробегаемся по полученному массиву невалидных полей и выставляем класс `.error`*(или убираем его)*
- `validDomains` - Разрешённые домены
- `intervalId` - Для реализации повторного запроса при ответе  `status: "progress"`. (ID счётчика)

---
- `server.js` - Простенький сервер, на котором тестировалось.

1. `npm install`
2. `localhost:3000`
