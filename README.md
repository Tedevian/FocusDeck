# ⏱️ Pomo2be – Desktop App con Electron

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Author: tedevs0](https://img.shields.io/badge/Author-tedevs0-blue.svg)](https://github.com/tedevs0)

Aplicación de escritorio construida con **Electron**,  funciona como entorno de ejecución independiente para PWA o herramientas de productividad.  
Ideal para proyectos con lógica en Node.js que necesitan una capa visual de escritorio.



## 📦 Características

- 🖥️ Empaquetado con [Electron](https://www.electronjs.org/)
- 🔒 Seguridad: `contextIsolation: true`, `nodeIntegration: false`
- 🔗 Soporte para etiquetas `<webview>`
- 🧪 DevTools abiertos por defecto para desarrollo



## 🚀 Requisitos

- Node.js 18 o superior
- npm o yarn



## ⚙️ Instalación

Clona el repositorio y entra a la carpeta:

```bash
git clone https://github.com/tedevs0/pomo2be.git
cd pomo2be
npm install
````



## ▶️ Modo Desarrollo

Ejecuta la aplicación en modo escritorio:

```bash
npm start
```

Esto abrirá la ventana principal cargando el archivo `index.html` y mostrará las herramientas de desarrollo.



## 📁 Estructura del Proyecto

```
pomo2be/
├── index.html           # Interfaz principal
├── main.js              # Proceso principal de Electron
├── preload.js           # Comunicación segura entre procesos
├── package.json
└── ...
```




## 💡 Ideas futuras

* 🎨 Selector de temas (modo claro/oscuro)



## 🤝 Contribuciones

Este proyecto es open source. Puedes hacer fork, mejorarlo y enviar pull requests.
También puedes adaptarlo para tus propias herramientas de escritorio.


## 📜 Licencia

MIT — libre de usar, modificar y compartir. No requiere conexión a YouTube Premium.

