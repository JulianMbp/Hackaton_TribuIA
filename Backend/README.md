# Proyecto Express

Un proyecto básico de Express.js con estructura organizada y configuración lista para desarrollo.

## 🚀 Características

- ✅ Express.js servidor web
- ✅ CORS habilitado
- ✅ Middleware para JSON
- ✅ Variables de entorno con dotenv
- ✅ Estructura de carpetas organizada
- ✅ Manejo de errores básico
- ✅ Nodemon para desarrollo

## 📁 Estructura del proyecto

```
├── src/
│   └── index.js          # Archivo principal del servidor
├── routes/               # Rutas de la API
├── middleware/           # Middleware personalizado
├── controllers/          # Controladores
├── .env                  # Variables de entorno
├── .gitignore           # Archivos a ignorar en Git
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Edita el archivo .env con tus configuraciones
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Rutas disponibles

- `GET /` - Ruta de bienvenida
- `GET /api/test` - Ruta de prueba de la API

## 🔧 Scripts disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta las pruebas (pendiente de configurar)

## 📝 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
# Agrega más variables según necesites
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.