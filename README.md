# TP Integrador Slack - Frontend

Este proyecto es el frontend de una aplicación estilo "Slack", desarrollada como Trabajo Práctico Integrador para la Diplomatura Full-Stack (UTN). Proporciona la interfaz de usuario para gestionar espacios de trabajo, canales y mensajes en tiempo real.

## Tecnologías Utilizadas

- **React**: Biblioteca principal para la construcción de interfaces de usuario.
- **Vite**: Herramienta de construcción rápida y empaquetador para el desarrollo frontend.
- **React Router DOM**: Para el enrutamiento y la navegación entre diferentes vistas (SPA).
- **CSS Vanilla**: Estilos personalizados y diseño adaptable.
- **Fetch API**: Para la comunicación con el backend (peticiones REST).

## Características Principales

- **Autenticación de Usuarios**: Registro, inicio de sesión, recuperación de contraseña y verificación de correo electrónico.
- **Gestión de Workspaces**: Crear, editar, eliminar y visualizar espacios de trabajo.
- **Gestión de Miembros**: Invitar usuarios a un espacio de trabajo y administrar sus roles (Owner, Admin, Member).
- **Canales de Comunicación**: Creación de canales dentro de un espacio de trabajo para segmentar la comunicación.
- **Mensajería en Tiempo Real**: Envío y recepción de mensajes en los diferentes canales, con soporte para borrado de mensajes.

## Requisitos Previos

Asegúrate de tener instalado en tu máquina lo siguiente:
- [Node.js](https://nodejs.org/) (v14 o superior recomendado)

## Instalación y Configuración

1. **Clona el repositorio** o descarga el código fuente.
2. **Instala las dependencias** abriendo una terminal en la raíz de la carpeta `FRONTEND` y ejecutando:
   ```bash
   npm install
   ```
3. **Configura el entorno**. Crea un archivo `.env` en la raíz del proyecto para definir la URL del backend:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

## Uso

Para arrancar el servidor de desarrollo, ejecuta:

```bash
npm run dev
```

Esto iniciará la aplicación frontend, generalmente accesible en `http://localhost:5173`.

## Documentación del Código

Todo el código fuente dentro de la carpeta `src` está documentado utilizando **JSDoc**. Esto permite a los desarrolladores comprender rápidamente el propósito de cada componente, función y gancho (hook) personalizado. Se detallan las entradas (props/parámetros) y salidas (returns) correspondientes a cada bloque lógico del aplicativo.
