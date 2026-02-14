# Angular Client (API Products)

Frontend en Angular 18 para gestion de productos financieros.

## Arquitectura usada (DDD + feature-based)

La feature `products` sigue una estructura por capas:

- `domain`: entidades y contratos de repositorio.
- `application`: facades/casos de uso.
- `infrastructure`: repositorios HTTP.
- `pages` y `components`: capa de presentacion.

Estructura principal:

```text
src/app/features/products/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
├── infrastructure/
│   └── repositories/
├── components/
└── pages/
```

## Como levantar el frontend

1. Levantar backend desde la raiz del repo:
   - `npm install`
   - `npm run start:dev`
2. En `bp_test`:
   - `npm install`
   - `npm start`

Aplicacion disponible en `http://localhost:4200`.

## Integracion con API

- URL backend: `http://localhost:3002`
- Prefijo backend: `/bp`
- Proxy local: `/bp -> http://localhost:3002`

Endpoints consumidos:

- `GET /bp/products`
- `GET /bp/products/:id`
- `GET /bp/products/verification/:id`
- `POST /bp/products`
- `PUT /bp/products/:id`
- `DELETE /bp/products/:id`

Configuracion de proxy en `proxy.conf.json`.
