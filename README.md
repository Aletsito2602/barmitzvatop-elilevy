# Firebase Data Architecture Guide for Claude Code 

Este es un proyecto para la plataforma online de Eli Levy. La aplicación está construida con React, Vite y Firebase, y utiliza Chakra UI para los componentes de la interfaz de usuario.

## Características

*   **Autenticación de Usuarios:** Sistema de registro e inicio de sesión con Firebase Authentication.
*   **Gestión de Contenido:** Clases en video, recursos y seguimiento del progreso.
*   **Comunidad Interactiva:** Foros de discusión y salas de chat en tiempo real para estudiantes.
*   **Perfiles de Usuario:** Paneles personalizados con progreso, logros y configuración.
*   **Integración de Pagos:** Proceso de pago para acceder a contenido premium.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
*   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

## Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### 1. Clona el Repositorio

Abre tu terminal y clona este repositorio en tu máquina:

```bash
git clone https://github.com/Aletsito2602/barmitzvatop-elilevy.git
cd barmitzvatop-elilevy
```

### 2. Instala las Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias necesarias usando `npm`:

```bash
npm install
```

### 3. Configura Firebase

Este proyecto utiliza Firebase para la base de datos, autenticación y almacenamiento.

1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2.  Dentro de tu proyecto de Firebase, crea una nueva aplicación web.
3.  Copia las credenciales de configuración de Firebase (`firebaseConfig`).
4.  Crea un archivo de configuración en la siguiente ruta: `src/firebase/config.js`.
5.  Pega tus credenciales de Firebase en `src/firebase/config.js` de la siguiente manera:

```javascript
// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Tu configuración de la aplicación web de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
```

Asegúrate de reemplazar `"TU_..."` con tus credenciales reales.

### 4. Ejecuta el Proyecto

Con las dependencias instaladas y Firebase configurado, puedes iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto ejecutará la aplicación en modo de desarrollo. Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal) para verla en tu navegador.

La página se recargará automáticamente si realizas cambios en el código.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

*   `npm run dev`: Inicia la aplicación en modo de desarrollo.
*   `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
*   `npm run lint`: Ejecuta el linter para revisar el estilo del código.
*   `npm run preview`: Sirve la compilación de producción localmente para previsualizarla.

## Estructura del Proyecto

```
barmitzvatop/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes y otros recursos
│   ├── components/      # Componentes de React reutilizables
│   ├── firebase/        # Configuración de Firebase
│   ├── hooks/           # Hooks personalizados de React
│   ├── services/        # Lógica de negocio y comunicación con APIs
│   └── ...
├── .gitignore           # Archivos ignorados por Git
├── index.html           # Plantilla HTML principal
├── package.json         # Dependencias y scripts del proyecto
└── README.md            # Este archivo
```

## Tecnologías Utilizadas

*   **Framework Frontend:** [React](https://reactjs.org/)
*   **Bundler:** [Vite](https://vitejs.dev/)
*   **Base de Datos y Backend:** [Firebase](https://firebase.google.com/)
*   **Librería de UI:** [Chakra UI](https://chakra-ui.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Iconos:** [React Icons](https://react-icons.github.io/react-icons/)
