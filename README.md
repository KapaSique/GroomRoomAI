<div align="center">

# 🐾 GroomRoomAI

**Современная платформа для записи в салон груминга**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

```
   ╔═══════════════════════════════════════════════════════╗
   ║                                                       ║
   ║   🐕  Запишите питомца на груминг онлайн  🐈          ║
   ║       Отслеживайте статус • Смотрите фото             ║
   ║                                                       ║
   ╚═══════════════════════════════════════════════════════╝
```

</div>

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Функциональность](#-функциональность)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Установка и запуск](#-установка-и-запуск)
- [База данных](#-база-данных)
- [API документация](#-api-документация)
- [Маршруты приложения](#-маршруты-приложения)
- [Аутентификация](#-аутентификация)

---

## 🌟 О проекте

**GroomRoomAI** — веб-приложение для управления заявками на услуги груминга домашних животных. Платформа предоставляет удобный интерфейс как для клиентов, так и для администраторов салона.

**Клиенты** могут подавать заявки с фотографиями своих питомцев, отслеживать статус обработки и оставлять отзывы после получения услуги. **Администраторы** обрабатывают заявки через удобную панель управления, переводят их по статусам и загружают фотографии результата.

---

## ✨ Функциональность

### 👤 Для клиентов
| Функция | Описание |
|---------|----------|
| 📝 Регистрация и вход | JWT-аутентификация с безопасными httpOnly cookies |
| 📸 Подача заявки | Загрузка фото питомца (JPEG/BMP, до 2MB) |
| 📊 Личный кабинет | Просмотр всех своих заявок и их статусов |
| 🗑️ Отмена заявки | Удаление заявок со статусом «Новая» |
| ⭐ Отзывы | Оставление отзыва после завершения услуги |

### 🛠️ Для администраторов
| Функция | Описание |
|---------|----------|
| 📋 Панель управления | Просмотр всех заявок от всех клиентов |
| 🔄 Смена статуса | Перевод заявок по этапам выполнения |
| 📷 Загрузка фото | Добавление фото «после» при завершении услуги |

### 🌐 Публичная часть
| Функция | Описание |
|---------|----------|
| 🏠 Лендинг | Презентационная страница салона |
| 💬 Карусель отзывов | Бесконечная прокрутка с отзывами клиентов |

---

## 🛠 Технологический стек

<div align="center">

| Категория | Технология | Версия |
|-----------|-----------|--------|
| **Фреймворк** | Next.js (App Router) | 15+ |
| **Язык** | TypeScript | 5 |
| **UI / Анимации** | Framer Motion | 12 |
| **ORM** | Prisma | 5 |
| **База данных** | SQLite | — |
| **Аутентификация** | JWT (jsonwebtoken) | 9 |
| **Хеширование** | bcryptjs | 3 |
| **Стили** | CSS Modules | — |

</div>

---

## 📁 Структура проекта

```
GroomRoomAI/
│
├── 📂 src/
│   ├── 📂 app/                        # Next.js App Router
│   │   ├── 📄 page.tsx                # Лендинг (публичный)
│   │   ├── 📄 layout.tsx              # Корневой лейаут
│   │   ├── 📄 globals.css             # Глобальные стили
│   │   │
│   │   ├── 📂 dashboard/
│   │   │   └── 📄 page.tsx            # Кабинет клиента
│   │   │
│   │   ├── 📂 admin/
│   │   │   └── 📄 page.tsx            # Панель администратора
│   │   │
│   │   └── 📂 api/
│   │       ├── 📂 auth/
│   │       │   ├── 📂 login/          # POST /api/auth/login
│   │       │   ├── 📂 register/       # POST /api/auth/register
│   │       │   └── 📂 logout/         # POST /api/auth/logout
│   │       └── 📂 requests/
│   │           ├── 📄 route.ts        # GET, POST /api/requests
│   │           └── 📂 [id]/
│   │               └── 📄 route.ts   # PATCH, DELETE /api/requests/:id
│   │
│   ├── 📂 components/
│   │   ├── 📂 ui/                     # Базовые UI компоненты
│   │   │   ├── 📄 Button.tsx
│   │   │   └── 📄 Input.tsx
│   │   ├── 📂 forms/                  # Формы входа и регистрации
│   │   │   ├── 📄 LoginForm.tsx
│   │   │   └── 📄 RegisterForm.tsx
│   │   ├── 📂 layout/
│   │   │   └── 📄 Header.tsx          # Навигационная шапка
│   │   ├── 📂 dashboard/
│   │   │   └── 📄 DashboardClient.tsx
│   │   ├── 📂 admin/
│   │   │   └── 📄 AdminClient.tsx
│   │   └── 📂 home/
│   │       ├── 📄 ReviewCarousel.tsx  # Карусель отзывов
│   │       └── 📄 AnimatedCard.tsx    # Анимированные карточки
│   │
│   └── 📂 lib/
│       ├── 📄 auth.ts                 # JWT утилиты
│       └── 📄 db.ts                   # Prisma клиент
│
├── 📂 prisma/
│   ├── 📄 schema.prisma               # Схема базы данных
│   ├── 📄 dev.db                      # SQLite файл
│   └── 📄 seed.js                     # Сидирование базы данных
│
├── 📂 public/
│   ├── 📂 demo/                       # Демо-изображения животных
│   └── 📂 uploads/                    # Загруженные фото клиентов
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 next.config.ts
└── 📄 .env
```

---

## 🚀 Установка и запуск

### Требования

- **Node.js** 20+
- **npm** или **yarn**

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd GroomRoomAI
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
JWT_SECRET=your-super-secret-key-here
```

### 4. Инициализация базы данных

```bash
# Применение схемы к SQLite
npx prisma db push

# (Опционально) Заполнение тестовыми данными
node prisma/seed.js
```

### 5. Запуск сервера разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Доступные скрипты

```bash
npm run dev      # Сервер разработки
npm run build    # Сборка для продакшена
npm run start    # Запуск продакшен-сборки
npm run lint     # Проверка ESLint
```

---

## 🗄 База данных

### Схема

```prisma
model User {
  id       Int       @id @default(autoincrement())
  fullname String                        // ФИО (кириллица)
  login    String    @unique             // Логин (латиница)
  email    String                        // Email
  password String                        // bcrypt хеш пароля
  role     String    @default("USER")    // "USER" или "ADMIN"
  requests Request[]
}

model Request {
  id          Int      @id @default(autoincrement())
  petName     String                     // Кличка животного
  status      String   @default("Новая") // Статус заявки
  beforePhoto String                     // Путь к фото «до»
  afterPhoto  String?                    // Путь к фото «после»
  reviewText  String?                    // Текст отзыва клиента
  createdAt   DateTime @default(now())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
}
```

### Статусы заявок

```
Новая  ──►  Обработка данных  ──►  Услуга оказана
 🆕               ⚙️                    ✅
```

---

## 📡 API Документация

### Аутентификация

#### `POST /api/auth/register`
Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "fullname": "Иван Иванов",
  "login": "ivan-ivanov",
  "email": "ivan@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Ответ `200`:**
```json
{ "success": true }
```

**Валидация:**
- `fullname` — только кириллица
- `login` — только латиница и дефис, уникальный
- `password` и `confirmPassword` — должны совпадать

---

#### `POST /api/auth/login`
Вход в систему.

**Тело запроса:**
```json
{
  "login": "ivan-ivanov",
  "password": "password123"
}
```

**Ответ `200`:**
```json
{ "success": true, "role": "USER" }
```

---

#### `POST /api/auth/logout`
Выход из системы (очистка cookie).

**Ответ `200`:**
```json
{ "success": true }
```

---

### Заявки на груминг

#### `GET /api/requests`
Получение заявок. Клиенты видят только свои, админы — все.

**Query параметры:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `filter` | `"finished"` | Только завершённые заявки (публичный доступ, до 4 штук) |

---

#### `POST /api/requests`
Создание новой заявки. Принимает `multipart/form-data`.

**Поля формы:**
| Поле | Тип | Описание |
|------|-----|----------|
| `petName` | `string` | Кличка животного |
| `photo` | `File` | Фото (JPEG или BMP, до 2MB) |

---

#### `PATCH /api/requests/:id`
Обновление заявки.

**Для администраторов** (смена статуса):
```json
{ "status": "Обработка данных" }
```

**Для администраторов** (завершение с фото): `multipart/form-data` с полем `afterPhoto`.

**Для клиентов** (добавление отзыва):
```json
{ "reviewText": "Отличная услуга! Спасибо!" }
```

---

#### `DELETE /api/requests/:id`
Удаление заявки со статусом «Новая». Только владелец заявки.

**Ответ `200`:**
```json
{ "success": true }
```

---

## 🗺 Маршруты приложения

| Маршрут | Доступ | Описание |
|---------|--------|----------|
| `/` | Публичный | Лендинг с каруселью отзывов |
| `/dashboard` | Клиент | Личный кабинет |
| `/admin` | Админ | Панель управления заявками |

---

## 🔐 Аутентификация

Система использует **JWT-токены** в **httpOnly cookies**.

```
┌─────────────┐     login/register     ┌─────────────┐
│   Браузер   │ ──────────────────────► │   Сервер    │
│             │ ◄────────────────────── │             │
│             │   Set-Cookie: token=…   │   Prisma    │
│             │   (httpOnly, 7 days)    │   SQLite    │
│             │                         │             │
│             │ ──── GET /dashboard ──► │             │
│             │      Cookie: token=…    │  verify JWT │
└─────────────┘ ◄── 200 OK / 401 ───── └─────────────┘
```

**Параметры токена:**
- Алгоритм: `HS256`
- Срок действия: `7 дней`
- Хранение: `httpOnly cookie` (защита от XSS)
- Флаг `Secure`: включён в продакшене

---

<div align="center">

Сделано с ❤️ для IMI Labs

</div>
