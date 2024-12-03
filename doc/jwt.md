# Авторизация по JWT

## Шаг 1. Создаем токен
Зайти на страницу "API токены". Добавить новый токен. В Method/URL накликать нужные эндпоинты.

![Example](jwt-add.png)

Список эндпоинтов для команд `yarn push/pull`:
- GET /api/auth/check
- GET /api/db/:dataset:ds.:table/:id:bipath
- PATCH /api/db/:dataset:ds.:table.:column/:id:any
- PATCH /api/db/:dataset:ds.:table
- PUT /api/db/:dataset:ds.:table
- GET /api/db/:dataset:ds.:table
- POST /api/db/:dataset:ds.:table
- DELETE /api/db/:dataset:ds.:table/:id:bipath
- PUT /api/db/:dataset:ds.:table/:id:any
- PUT /srv/resources/:dataset:ds/:id:bipath
- GET /srv/resources/:dataset:ds/:id:bipath

Чтобы запустился `yarn start` понадобится выбрать все эндпоинты, как минимум все запросы с `/api/`


## Шаг 2. Передать токен
- Через опции командной строки
- Переменные окружения
- Файлы конфигурации

## Шаг 3. Запускаем команду
```bash
yarn start
yarn push
yarn pull
```
