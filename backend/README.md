# Система обслуживания оборудования

Бэкенд для учёта оборудования и управления заявками на осмотр и ремонт

## Стек

- Node.js 24
- PostgreSQL
- JavaScript
- Express
- PostgreSQL
- Sequelize
- JWT
- Zod
- pino
- Docker

## Настройка

1. Установить зависимости: `npm install`
2. Настроить `.env`: `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `ACCESS_TOKEN_SECRET` (не менее 32 символов); опционально `PG_HOST`, `PG_PORT`, `PORT`, `CORS_ORIGINS`, `ACCESS_TOKEN_TTL_SECONDS`, `BCRYPT_ROUNDS`
3. Запустить PostgreSQL: `docker compose up -d db --build`
4. Применить миграции: `npx sequelize-cli db:migrate`
5. Добавить в /data файл exml с данными в базу и выполнить команды для заполнения базы: `python3 -m pip install -r requirements.txt`

## Возможности

- Аутентификация через JWT
- Просмотр оборудования и истории обслуживания, импорт из Excel
- Создание и редактирование заявок, назначение исполнителей и изменение статусов

## Запуск

Потребуются Node.js 24, npm и Docker Compose для базы данных. Команды выполняются из папки `backend`

1. Установите зависимости:

   ```bash
   npm ci
   ```

2. Скопируйте `.env.example` в `.env`. Укажите `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` и замените `ACCESS_TOKEN_SECRET` на строку длиной не менее 32 символов. Для локального запуска `PG_HOST=localhost`

3. Запустите PostgreSQL и после готовности базы примените миграции:

   ```bash
   docker compose up -d db
   npx sequelize-cli db:migrate
   ```

4. Запустите сервер:

   ```bash
   npm run dev
   ```

API доступен по адресу `http://localhost:4000`
Проверка работы: `GET /api/health`

## Основные маршруты

| Метод | Путь | Назначение |
| --- | --- | --- |
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/equipment` | Список оборудования |
| GET | `/api/equipment/:id` | Карточка оборудования |
| GET | `/api/equipment/:id/history` | История обслуживания |
| POST | `/api/equipment/import` | Импорт из Excel |
| GET, POST | `/api/requests` | Список и создание заявок |
| GET, PATCH | `/api/requests/:id` | Просмотр и редактирование заявки |
| POST | `/api/requests/:id/assign` | Назначение исполнителя |
| POST | `/api/requests/:id/status` | Изменение статуса |

Для регистрации и входа передайте JSON с полями `login` и `password` (пароль - от 8 символов)
Для оборудования и заявок нужен заголовок `Authorization: Bearer <accessToken>`

## Команды

- `npm run dev` - запуск с автоматическим перезапуском
- `npm start` - запуск сервера
- `npm run lint` - проверка кода ESLint

## Авторизация

- `POST /api/auth/register` с `{ "login": "user1", "password": "минимум 8 символов" }` создаёт пользователя с ролью `engineer`. Открытая регистрация не выдаёт привилегированную роль `duty`.
- `POST /api/auth/login` с теми же логином и паролем возвращает JWT

### Роли и права

- `duty` (дежурный) — полный доступ, включая управление пользователями и импорт оборудования.
- `director` (технический директор) — просмотр оборудования и пользователей, создание/изменение заявок и назначение инженеров; без управления пользователями и импорта.
- `engineer` (инженер) — просмотр оборудования и назначенных ему заявок, изменение статуса этих заявок.
- В БД заявки связаны с оборудованием через `equipment_ref_id`, а автор и исполнитель хранятся в `author_id` и `assignee_id`; новые внешние ключи к `users.id` добавляются миграцией `20261028213000-add-request-user-foreign-keys`.
- Права проверяются на сервере. Скрытие пунктов меню и кнопок на фронтенде не заменяет серверную проверку.
- Для запросов к `/api/equipment` и `/api/requests` передавайте `Authorization: Bearer <accessToken>`

## Импорт оборудования

Импорт данных из Excel запускается командой. Пример вызова через API:

`POST /api/equipment/import` с body `{ "filePath": "path/to/book.xlsx" }`
Или через сервис `importFromFixedBook(filePath)` из `src/services/equipment.js`.

## Созданы пользователи с ролями

- duty - дежурный
- engineer - сервисный инженер
- director - технический директор

## Реализовано

- Модели и миграции для реестра оборудования, истории, заявок, пользователей
- Импорт оборудования
- Ручные заявки осмотр-ремонт, статусы, переходы, история изменений, контроль закрытия
