# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Organización del repositorio

- `Made/` es el código fuente del proyecto. Ahí está tu aplicación React con toda la lógica, componentes y configuración de Vite.
- `Made/` es el código fuente del proyecto. Ahí está tu aplicación React con toda la lógica, componentes y configuración de Vite. El archivo `index.html` dentro de `Made/` sirve para ejecutar el proyecto en desarrollo con `npm run dev` localmente.
- `docs/` es solo el build estático que GitHub Pages puede servir desde el branch `main` si eliges `/docs` como fuente.

### Cómo organizar varias webs en un solo repo

Puedes mantener varios proyectos fuente separados, por ejemplo:

- `Made/`
- `Pedro/`

Y sus builds organizados dentro de `docs/`, por ejemplo:

- `docs/Made/`
- `docs/Pedro/`

De ese modo, GitHub Pages puede servir:

- `https://frameix.github.io/feliz-cumple/Made/`
- `https://frameix.github.io/feliz-cumple/Pedro/`

Recuerda que GitHub Pages solo publica la carpeta que elijas (`/docs` o `/root`), no el código fuente directo de `Made/`.

