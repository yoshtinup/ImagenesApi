# API de Imágenes - Arquitectura Hexagonal

Este proyecto implementa una API REST para la gestión de imágenes utilizando **Arquitectura Hexagonal** (también conocida como Puertos y Adaptadores).

## 🏗️ Estructura del Proyecto

```
ImagenesApi/
├── app.js                          # Punto de entrada de la aplicación
├── package.json
├── uploads/                        # Carpeta donde se almacenan las imágenes
└── src/
    ├── domain/                     # Capa de Dominio (Núcleo)
    │   ├── entities/
    │   │   └── Image.js           # Entidad de dominio Image
    │   └── ports/
    │       └── ImageRepository.js  # Puerto (Interface) del repositorio
    │
    ├── application/                # Capa de Aplicación
    │   └── use-cases/
    │       ├── UploadImageUseCase.js
    │       ├── GetImageUseCase.js
    │       ├── ListImagesUseCase.js
    │       ├── DeleteImageUseCase.js
    │       └── UpdateImageUseCase.js
    │
    ├── infrastructure/             # Capa de Infraestructura
    │   ├── adapters/
    │   │   ├── controllers/
    │   │   │   └── ImageController.js
    │   │   ├── repositories/
    │   │   │   └── FileSystemImageRepository.js
    │   │   └── routes/
    │   │       └── image.routes.js
    │   └── config/
    │       ├── multer.config.js
    │       └── server.js
    │
    └── shared/                     # Utilidades compartidas
```

## 📚 Capas de la Arquitectura Hexagonal

### 1. **Domain (Dominio)** - El Núcleo
La lógica de negocio pura, independiente de frameworks y tecnologías externas.

- **Entities**: `Image.js` - Representa la entidad de imagen con sus reglas de negocio.
- **Ports**: `ImageRepository.js` - Define el contrato (interface) que debe cumplir cualquier repositorio.

### 2. **Application (Aplicación)** - Casos de Uso
Orquesta la lógica de negocio implementando casos de uso específicos.

- `UploadImageUseCase`: Subir una imagen
- `GetImageUseCase`: Obtener una imagen por nombre
- `ListImagesUseCase`: Listar todas las imágenes
- `DeleteImageUseCase`: Eliminar una imagen
- `UpdateImageUseCase`: Actualizar una imagen existente

### 3. **Infrastructure (Infraestructura)** - Adaptadores
Implementaciones concretas que conectan el dominio con el mundo exterior.

- **Controllers**: Manejan las peticiones HTTP
- **Repositories**: Implementación del puerto de repositorio (FileSystem)
- **Routes**: Configuración de rutas Express
- **Config**: Configuraciones de Multer y del servidor

## 🚀 Endpoints de la API

### Subir una imagen
```http
POST /upload
Content-Type: multipart/form-data

Campo: image (archivo)
```

### Obtener una imagen
```http
GET /image/:filename
```

### Listar todas las imágenes
```http
GET /images
```

### Eliminar una imagen
```http
DELETE /image/:filename
```

### Actualizar una imagen
```http
PUT /image/:filename
Content-Type: multipart/form-data

Campo: image (archivo)
```

## 🎯 Ventajas de la Arquitectura Hexagonal

1. **Separación de responsabilidades**: Cada capa tiene un propósito específico
2. **Testabilidad**: El dominio puede testearse sin dependencias externas
3. **Mantenibilidad**: Cambios en una capa no afectan a las demás
4. **Flexibilidad**: Fácil cambiar implementaciones (ej: de FileSystem a S3)
5. **Independencia de frameworks**: El núcleo no depende de Express, Multer, etc.

## 🔄 Flujo de una Petición

```
Cliente → Router → Controller → Use Case → Repository → FileSystem
                                    ↓
                               Domain Entity
```

## 🛠️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar el servidor
npm start

# Modo desarrollo
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 📦 Dependencias

- **express**: Framework web
- **multer**: Manejo de archivos multipart/form-data
- **cors**: Configuración de CORS

## 🔮 Posibles Mejoras

- Agregar validaciones más robustas
- Implementar manejo de errores centralizado
- Añadir logging
- Crear tests unitarios y de integración
- Implementar otros adaptadores de repositorio (S3, MongoDB GridFS, etc.)
- Agregar autenticación y autorización
- Implementar compresión de imágenes
- Agregar paginación en listado de imágenes
