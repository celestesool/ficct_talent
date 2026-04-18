# FICCT Talent - Frontend

Plataforma de gestión de talento para la FICCT (Facultad de Ciencias y Tecnología).

## Descripción

Sistema web para la gestión integral de talento, incluyendo búsqueda de empleos, publicación de ofertas y análisis de habilidades.

## Requisitos

- Node.js (v16 o superior)
- npm o yarn

## Instalación

```bash
npm install
```

## Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se abrirá en `http://localhost:5173/`

## Build

Para generar la versión de producción:

```bash
npm run build
```

## Preview

Para ver la versión de producción en local:

```bash
npm run preview
```

## Características

- Dashboard adaptable para diferentes roles de usuario
- Búsqueda integrada de empleos con LinkedIn
- Editor de secciones con opciones de formato
- Tema dinámico personalizable
- Componentes UI reutilizables

## Tecnologías

- React 18
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- TinyMCE (Rich Text Editor)
- Recharts (Visualización de datos)

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── store/         # Estado global (Zustand)
├── styles/        # Estilos globales
└── App.jsx        # Componente principal
```

## Autor

FICCT Talent Team

## Licencia

MIT
