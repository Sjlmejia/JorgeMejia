# Product Management System

Sistema para gestión de productos financieros con backend en Node.js y frontend en Angular.

## Arquitectura usada (DDD)

El enfoque DDD está aplicado principalmente en el frontend (`angular-client`) usando una organización por capas dentro de la feature `products`:

- `domain`: entidades y contratos (interfaces de repositorio).
- `application`: casos de uso/facades que orquestan reglas de negocio.
- `infrastructure`: implementación técnica (repositorios HTTP).
- `presentation`: páginas y componentes.

El backend (`src`) expone una API REST simple con `routing-controllers` para soportar los casos de uso del frontend.

## Estructura del proyecto

```text
repo-interview-main/
├── src/                                  # Backend API
│   ├── controllers/
│   ├── dto/
│   ├── interfaces/
│   ├── const/
│   └── main.ts
└── angular-client/                       # Frontend Angular
    └── src/app/features/products/
        ├── domain/
        │   ├── entities/
        │   └── repositories/
        ├── application/
        ├── infrastructure/
        │   └── repositories/
        ├── components/
        └── pages/
```

## Requisitos

- Node.js 18+ (recomendado LTS).
- npm 9+.

## Como levantar el proyecto

### 1) Backend

Desde la raiz del repositorio:

```bash
npm install
npm run start:dev
```

Backend disponible en `http://localhost:3002` con prefijo de rutas `/bp`.

Ejemplo: `GET http://localhost:3002/bp/products`

### 2) Frontend

En otra terminal:

```bash
cd angular-client
npm install
npm start
```

Frontend disponible en `http://localhost:4200`.

## Proxy frontend -> backend

Configurado en `angular-client/proxy.conf.json`:

```json
{
  "/bp": {
    "target": "http://localhost:3002",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Scripts utiles

Backend (raiz):

```bash
npm run start:dev
npm run build
```

Frontend (`angular-client`):

```bash
npm start
npm run build
npm test
npm run test:coverage
```
