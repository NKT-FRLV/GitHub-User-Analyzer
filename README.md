# WONDER - GitHub User Analyzer

Приложение для поиска, анализа и сохранения профилей GitHub разработчиков для последующего рассмотрения на позиции.

## Основные возможности

- Поиск разработчиков GitHub по имени пользователя
- Анализ профиля разработчика, его репозиториев и используемых языков программирования
- Регистрация и авторизация пользователей
- Сохранение профилей разработчиков как потенциальных кандидатов на позицию
- Управление сохраненными кандидатами

## Технологический стек

- **Frontend**: Next.js 15, React 19, TypeScript, Material UI 6
- **Backend**: Next.js API Routes
- **База данных**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Аутентификация**: JWT с использованием библиотеки jose
- **API**: GitHub API, OpenAI API

## Настройка и запуск проекта

### Предварительные требования

- Node.js 18+ и npm
- Учетная запись Supabase с PostgreSQL базой данных
- Токен доступа GitHub API
- (Опционально) Токен доступа OpenAI API для анализа кода

### Шаги установки

1. Клонируйте репозиторий:

```bash
git clone https://github.com/username/wonder.git
cd wonder
```

2. Установите зависимости:

```bash
npm install
```

3. Настройте переменные окружения в файле `.env`:

```
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://user:password@aws-0-region.supabase.com:5432/postgres"

# GitHub API
GITHUB_API_TOKEN=your_github_token
NEXT_PUBLIC_GITHUB_API_TOKEN=your_github_token

# Admin credentials
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=your_admin_email

# JWT secrets
JWT_SECRET=your_jwt_secret_at_least_32_chars
REFRESH_SECRET=your_refresh_secret_at_least_32_chars

# OpenAI (optional)
OPENAI_API_KEY=your_openai_api_key
```

4. Инициализируйте базу данных и запустите миграции:

```bash
npx prisma migrate reset -f
```

5. Заполните базу данных начальными данными:

```bash
npm run prisma:seed
```

6. Запустите приложение в режиме разработки:

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

- `app/` - Исходный код приложения (Next.js App Router)
  - `api/` - API-маршруты и утилиты для бэкенда
  - `components/` - React-компоненты
  - `context/` - Контекст приложения для глобального состояния
  - `lib/` - Библиотеки и утилиты
  - `types/` - TypeScript-типы
- `prisma/` - Схема базы данных и миграции
- `public/` - Статические файлы

## Основные функции и их использование

### Авторизация

В приложении реализована JWT-авторизация с использованием access и refresh токенов. Токены хранятся в http-only cookies для безопасности.

- `/auth/register` - Регистрация нового пользователя
- `/auth/login` - Вход в систему
- `/auth/logout` - Выход из системы

### Работа с кандидатами

- `/candidates` - Страница со списком сохраненных кандидатов
- `/api/candidates` - API для сохранения и удаления кандидатов

## Лицензия

MIT

