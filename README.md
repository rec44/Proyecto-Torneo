# Proyecto Torneos

## Descripción

Este proyecto es una plataforma web para la gestión de torneos deportivos. Permite a los usuarios crear, buscar e inscribirse en torneos, gestionar equipos, visualizar brackets y partidos, y administrar usuarios y torneos desde un panel de administración. Incluye funcionalidades de autenticación, filtros avanzados, historial de partidos, calendario de torneos y gestión de resultados en tiempo real.

## Tecnologías utilizadas

- **React** (Vite o Create React App)
- **TypeScript**
- **React Router**
- **Tailwind CSS** (o CSS Modules)
- **SweetAlert2** (para notificaciones)
- **JSON-server** o API REST simulada para datos
- **React Hook Form** y **Yup** (validación de formularios)
- **react-tournament-bracket** (visualización de brackets de torneos)
- **Context API** (gestión de autenticación)
- **Otras librerías auxiliares** (por ejemplo, date-fns, lodash)

## Instrucciones de instalación y ejecución

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tu-usuario/proyecto-torneos.git
   cd proyecto-torneos
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **(Opcional) Inicia el servidor de datos simulado:**
   ```sh
   npx json-server --watch db.json --port 3001
   ```

4. **Inicia la aplicación:**
   ```sh
   npm run dev
   ```
   o si usas Create React App:
   ```sh
   npm start
   ```

6. **Accede a la aplicación:**
   - Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique tu terminal).

## Notas

- Puedes crear usuarios, torneos y equipos desde la propia aplicación.
- El panel de administración está disponible para usuarios con rol de administrador.
- El proyecto es fácilmente ampliable para otros deportes o reglas de torneo.
- Si tienes dudas, revisa los comentarios en el código fuente para entender la estructura y lógica de cada componente.

