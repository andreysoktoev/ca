### Задание
Используя NodeJS реализуйте REST API для получения, добавления, редактирования и удаления данных о пользователе и его прочитанных книгах.
Пример данных
```
{
  "id": 2,
  "firstName": "Bob",
  "lastName": "Davidson",
  "age": 21,
  "isFree": true,
  "createdAt": "2022-03-25",
  "updatedAt": "2022-03-27",
  "Books": [{
    "id": 43,
    "title": "Clean Architecture",
    "author": "Rober Martin"
    "createdAt": "2022-03-25",
  }]
}
```

При реализации можете использовать любой NodeJS фреймворк, к примеру: Express, Koa, Nest и пр.
Будет большим плюсом:
 + использование реляционной базы данных, к примеру PostgreSQL
 + использование Typescript
 + реализация GraphQL
 + unit тестирование
 + настройки Docker-composer для запуска NodeJS + PostgreSQL
 + описание в README как запустить ваше приложение + ERD вашей бд

⚠️⚠️⚠️Важно:⚠️⚠️⚠️
Тестовое задание нужно загрузить на ваш личный Github или Gitlab аккаунт.