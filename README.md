
# BG3 Spelldex

BG3 Spelldex es una aplicación web que muestra todos los hechizos disponibles en Baldur's Gate 3, permitiendo explorar por clase y ver detalles de cada hechizo.

## Funcionalidad principal

- Visualiza el listado completo de hechizos agrupados por nivel y clase.
- Navega por las clases de personaje (Bardo, Clérigo, Druida, Hechicero, Brujo, Mago) y consulta los hechizos que cada una puede aprender.
- Accede a los detalles de cada hechizo: nombre, icono, nivel, tipo, acción, duración, alcance y daño.
- Interfaz accesible con navegación por teclado y soporte para modales de detalles.
- Búsqueda y filtrado visual por clase y hechizo.

## Tecnologías utilizadas

- **React** 19
- **TypeScript**
- **Vite** para desarrollo y build
- **Jest** para tests unitarios
- **Playwright** para tests de integración
- **ESLint** para linting

## Estructura del proyecto

- `src/components/` — Componentes visuales principales (ClassGrid, SpellDiagram, SpellDetailsDialog)
- `src/pages/` — Páginas de navegación (Home, ClassPage, NotFound)
- `src/data/` — Datos estáticos de clases y hechizos
- `src/models/` — Tipos TypeScript para clases y hechizos
- `public/assets/` — Iconos e imágenes

## Scripts principales

- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Compila la aplicación para producción
- `npm run test:unit` — Ejecuta tests unitarios (Jest)
- `npm run test:integration` — Ejecuta tests de integración (Playwright)

## Instalación y uso

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Inicia el servidor: `npm run dev`
4. Accede a la app en `http://localhost:5173`

## Licencia

MIT

