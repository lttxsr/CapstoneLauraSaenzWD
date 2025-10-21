
# **Capstone Laura Saenz – Biblioteca Universitaria**


##  Despliegue en Producción

- **Frontend:** [https://capstonelaurasaenzclient.up.railway.app/](https://capstonelaurasaenzclient.up.railway.app/)
- **Backend (API):** [https://capstonelaurasaenzserver.up.railway.app/](https://capstonelaurasaenzserver.up.railway.app/)


## Visión General del Proyecto

Este proyecto consiste en una **Aplicación de Página Única (SPA)** diseñada para **gestionar y explorar libros en una biblioteca universitaria**.  
Los usuarios pueden:

- Navegar por un catálogo de libros obtenido desde una API pública.  
- Buscar por palabras clave.  
- Filtrar por categorías o géneros.  
- Ver información detallada de cada libro.  
- Tomar libros en préstamo y hacer seguimiento de ellos.  
- Ver fechas de vencimiento de los préstamos.

## Arquitectura General

El proyecto está dividido en dos módulos principales:

| Módulo | Descripción | Tecnologías |
|--------|--------------|-------------|
| **Frontend** | SPA desarrollada con React y TypeScript. Se comunica con la API para mostrar y gestionar los datos. | React, TypeScript, Tailwind CSS |
| **Backend** | API RESTful que maneja usuarios, libros y préstamos, con autenticación JWT. | Express, Prisma, PostgreSQL |


## Estructura del Proyecto

```
apps/
├── client/       # Frontend (React + Next.js)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
└── server/       # Backend (Express + Prisma)
├── src/
├── prisma/
├── package.json
└── .env

```


## Configuración del Entorno Local

Para ejecutar el proyecto localmente, debes crear los archivos `.env` correspondientes en **cada subproyecto**:

### Frontend (`apps/client/.env.local`)
```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000
````

### Backend (`apps/server/.env`)

```bash
PORT=4000
DATABASE_URL="postgresql://neondb_owner:npg_Ej1lHR2OKqse@ep-silent-math-adiv3fvh.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET=super-secreto-mega-secretisimo
CORS_ORIGIN=http://localhost:3000
```

---

## Ejecución del Proyecto

### Clonar el repositorio

```bash
git clone [https://github.com/<tuusuario/capstone-laura-saenz.git](https://github.com/lttxsr/CapstoneLauraSaenz.git)
cd capstone-laura-saenz
```

### Instalar dependencias

```bash
cd apps/server
npm install
cd ../client
npm install
```

### Ejecutar el backend

```bash
cd apps/server
npm run dev
```

La API estará disponible en **[http://localhost:4000](http://localhost:4000)**

### Ejecutar el frontend

```bash
cd apps/client
npm run dev
```

La aplicación estará disponible en  **[http://localhost:3000](http://localhost:3000)**

## Base de Datos

* Motor: **PostgreSQL**
* ORM: **Prisma**
* Entidades principales:

  * `User`
  * `Book`
  * `Loan`

Para sincronizar el esquema:

```bash
cd apps/server
npx prisma migrate dev
```

## Autenticación

* Sistema basado en **JWT (JSON Web Tokens)**.
* Los endpoints protegidos requieren encabezado:

  ```
  Authorization: Bearer <token>
  ```
* El frontend maneja login/logout y persistencia del token en localStorage.

## Endpoints Principales (API)

| Método   | Ruta                 | Descripción                   |
| -------- | -------------------- | ----------------------------- |
| `POST`   | `/api/auth/register` | Registro de usuario           |
| `POST`   | `/api/auth/login`    | Inicio de sesión              |
| `GET`    | `/api/books`         | Obtener catálogo de libros    |
| `GET`    | `/api/books/:id`     | Ver detalles de un libro      |
| `POST`   | `/api/loans`         | Crear un préstamo             |
| `GET`    | `/api/loans`         | Listar préstamos del usuario  |
| `DELETE` | `/api/loans/:id`     | Cancelar o finalizar préstamo |

## Tecnologías Principales

| Categoría         | Herramientas                    |
| ----------------- | ------------------------------- |
| **Frontend**      | React, TypeScript, Tailwind CSS |
| **Backend**       | Node.js, Express, TypeScript    |
| **ORM**           | Prisma                          |
| **Base de Datos** | PostgreSQL                      |
| **Autenticación** | JWT                             |
| **Despliegue**    | Railway                         |
| **API Externa**   | Open Library API                |

##  Scripts Disponibles

### Backend (`apps/server`)

```bash
npm run dev        # Inicia en modo desarrollo
npm run build      # Compila TypeScript
npm start          # Ejecuta la build en producción
```

### Frontend (`apps/client`)

```bash
npm run dev        # Ejecuta entorno local
npm run build      # Genera build de producción
npm start          # Corre la build en producción
```

---

## 🧩 Integración con API Pública

El catálogo de libros se obtiene desde **Open Library API**, lo que permite mostrar resultados actualizados, portadas e información de autores.

Libreria consumida:

```
https://openlibrary.org/search.json?q=programming
```


## Estado del Proyecto

✅ Desplegado y funcional
📗 Funcionalidades principales completas
🧭 Pendientes:

* Mejorar estilos responsive.
* Validaciones de formularios.
* Gestión avanzada de usuarios (roles, historial, etc.).

## Licencia

```
MIT License  
© 2025 Laura Saenz  
```

## 👩‍💻 Autora

**Laura Saenz**
Desarrolladora Full Stack | Proyecto Capstone Universitario

## Contacto

Si tienes preguntas o sugerencias, puedes contactar a:

* Laura Saenz – *laura.saenz@jala.university*
* Repositorio en GitHub: [https://github.com/lttxsr/CapstoneLauraSaenz](https://github.com/lttxsr/CapstoneLauraSaenz)

Muchas gracias por revisar el proyecto. ¡Espero que lo encuentres útil y motivador! 
