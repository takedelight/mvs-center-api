# MVS API

API для системи **MVS Center**.

## Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/takedelight/mvs-center-api.git
cd mvs-center-api
npm install
```

### 2. Налаштування середовища

Скопіюйте приклад конфігурації та відредагуйте за потреби:

```bash
cp .env.example .env
# Відредагуйте .env за вашим середовищем (порт, URL бази, ключі)
```

### 3. Запуск через Docker

```bash
docker-compose up -d
```

Перевірте, що контейнери запущені:

```bash
docker ps
```

API буде доступне за адресою: [http://localhost:3000](http://localhost:3000)

### 4. Запуск без Docker

```bash
npm run dev
```

### 5. Збірка та запуск для продакшн

```bash
npm run build
npm run start
```

### 6. Доступ до API

API працює на [http://localhost:3000](http://localhost:3000)
