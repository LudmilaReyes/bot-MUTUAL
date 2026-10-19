# 🤖 Bot de WhatsApp para atención y ventas · Mutual MEBNA

Asistente virtual de WhatsApp que atiende a **socios y no socios** de una mutual: muestra desarrollos inmobiliarios, viajes, seguros y ayudas económicas, recolecta los datos de cada interesado y lo **conecta en tiempo real con un asesor humano** a través de Telegram.

Corre sobre **Cloudflare Workers** (sin servidores propios) y usa la **API oficial de WhatsApp Cloud (Meta)**.

> Proyecto desarrollado de forma individual durante mi trabajo en la Mutual de Empleados del Banco de la Nación Argentina (2026).



## 🎯 Problema que resuelve

Las consultas sobre barrios, viajes y seguros llegaban sueltas y había que responder lo mismo muchas veces. El bot responde lo frecuente al instante, a cualquier hora, y entrega al asesor el contacto ya calificado, con el recorrido que hizo el cliente. Además permite que cualquier asesor continúe la conversación evitando demoras al cliente

## ✨ Funcionalidades

| Área | Qué puede hacer el usuario |
|------|----------------------------|
| 🏘️ **Loteos y barrios** | Explorar 5 desarrollos (Cepas de Junín, Los Álamos, Cepas de Bonarda, Ancellotta y Cepas de Russell): ver casas, dúplex y lotes, planos, ubicación en el mapa, servicios, galería de fotos y reglamento en PDF |
| ✈️ **Turismo y viajes** | Ver destinos y convenios, elegir uno y dejar sus datos para que un asesor continúe la gestión |
| 🛡️ **Seguros** | Cotizar Automotores, Motovehículos, Hogar e Incendio, Vida Colectivo y Cobertura Sepelio, con preguntas específicas según el ramo; consultar pólizas vigentes |
| 💸 **Ayuda económica** | Consultar préstamos y convenios con un asesor |
| 🏥 **Asistencia médica** | Conectarse con el sector de salud |

Además:
- **Atención humana integrada:** al pedir un asesor, el bot crea un hilo en un grupo de Telegram con el contexto del cliente (nombre, interés y recorrido dentro del menú). Los mensajes, y también los **audios**, se reenvían en ambas direcciones.
- **Salida en cualquier momento:** el usuario puede escribir `menu`, `salir`, `cancelar`, `inicio` o `reset` y vuelve al menú principal; el hilo con el asesor se cierra solo.
- **Validación de datos:** controla el formato de nombre y DNI antes de avanzar.
- **Mensajes interactivos nativos** de WhatsApp: listas, botones de enlace, ubicación, imágenes y documentos.

## 💬 Ejemplo de conversación

```
Bot:      👋 ¡Hola! Selecciona una de las opciones para orientarte:
          [🏘️ Loteos y Barrios · 🛡️ Seguros · 🏥 Asistencia · 💸 Ayuda · ✈️ Viajes]
Usuario:  🛡️ Seguros Generales
Bot:      [Automotores · Motovehículos · Hogar · Vida · Sepelio · Pólizas]
Usuario:  Automotores
Bot:      Ingresá tu nombre y apellido
Usuario:  [nombre]
Bot:      Gracias. Ahora ingresá tu DNI (solo números)
Usuario:  [DNI]
Bot:      Indicá marca, modelo y año del bien
Usuario:  [detalle]
Bot:      Conectando con asesor de Seguros - Automotores... ✅
```

<!-- Reemplazá por una conversación de prueba, sin datos de personas -->

## 🏗️ Arquitectura

```
Usuario ──► WhatsApp ──► Meta Cloud API ──► Cloudflare Worker ──► Meta Graph API ──► Usuario
                                                │
                       ┌────────────────────────┼─────────────────────────┐
                       ▼                        ▼                         ▼
                 Workers KV                Cloudflare D1            Telegram Bot API
          (estado de la sesión,        (registro de eventos        (hilo por cliente para
           historial, TTL 1 h)          y leads)                    atención humana)
```

- **Webhook único** que distingue si el mensaje viene de WhatsApp o de Telegram.
- **Máquina de estados** guardada en KV: cada usuario tiene un paso actual (por ejemplo, esperando nombre, esperando DNI, modo humano).
- **Respuesta rápida a Meta:** el procesamiento se hace en segundo plano con `ctx.waitUntil`, para devolver `200 OK` de inmediato y evitar reintentos duplicados.
- **Proxy de medios:** sirve algunas imágenes con el tipo de contenido correcto para que WhatsApp las acepte (por ejemplo, archivos `.jfif`), con caché de 24 h.
- **Fallbacks:** si falla el envío de una imagen, el bot manda el mismo contenido como texto.

## 🛠️ Tecnologías

- JavaScript (ES Modules)
- Cloudflare Workers, Workers KV y D1 (SQLite)
- WhatsApp Cloud API (Meta Graph API v20.0)
- Telegram Bot API (temas de foro para la atención humana)
- Web Crypto API (verificación de firma HMAC-SHA256 de los webhooks)

## 📁 Estructura del proyecto

```
[COMPLETAR con el árbol real, por ejemplo:]
├── index.js          # Worker: webhook, lógica, menús e integraciones
├── wrangler.toml     # Configuración de Cloudflare (bindings KV y D1)
├── schema.sql        # Tabla de logs
└── .env.example      # Nombres de variables (sin valores)
```

## 🚀 Instalación y despliegue

Requisitos: cuenta de Cloudflare, una app en Meta for Developers con WhatsApp Business configurado y un bot de Telegram.

```bash
git clone https://github.com/[tu-usuario]/[nombre-del-repo].git
cd [nombre-del-repo]
npm install -g wrangler

# Crear la base de datos de logs
wrangler d1 execute DB_LOGS --file=schema.sql

# Cargar los secretos (uno por uno)
wrangler secret put META_TOKEN
# ...repetir para cada variable de la tabla

wrangler deploy
```

Después, en Meta for Developers, configurá la URL del Worker como webhook de WhatsApp y suscribite al campo `messages`.

**Variables y bindings necesarios** (los valores nunca se suben al repositorio):

| Nombre | Tipo | Uso |
|--------|------|-----|
| `VERIFY_TOKEN` | Secreto | Verificación inicial del webhook de Meta |
| `META_APP_SECRET` | Secreto | Validar la firma de los mensajes entrantes |
| `META_TOKEN` | Secreto | Enviar mensajes por la API de WhatsApp |
| `PHONE_NUMBER_ID` | Secreto | Identifica el número de WhatsApp Business |
| `TELEGRAM_TOKEN` | Secreto | Bot de Telegram para la atención humana |
| `TELEGRAM_CHAT_ID` | Secreto | Grupo donde se crean los hilos |
| `TELEGRAM_SECRET` | Secreto | Validar los webhooks de Telegram |
| `ESTADO_BOT` | Binding KV | Estado de sesión por usuario |
| `DB_LOGS` | Binding D1 | Registro de eventos y leads |

## 🔒 Seguridad y privacidad

- Verificación del webhook con token y validación de la firma `X-Hub-Signature-256`.
- Secreto compartido para los webhooks de Telegram.
- Las sesiones en KV expiran a la hora y el hilo de atención a las 24 h.
- El bot solicita nombre y DNI únicamente para cotizar seguros, y esos datos se envían al asesor por Telegram.
- Este repositorio no contiene credenciales ni datos reales de personas.

## 📚 Aprendizajes

- Información al asesor, priorizando que el cliente no deba repetir información ya otorgada
- Diseño de conversaciones con menús interactivos y límites de longitud de la API de WhatsApp.
- Arquitectura serverless y manejo de estado con KV.

## 🔮 Próximas mejoras

- Panel de métricas a partir de los logs
- Tests automáticos
- Recibir y enviar, imágenes y videos
- Agregar agenda de turnos

## 👩‍💻 Autora

**Ludmila Micaela Reyes Martínez**
Estudiante de Ingeniería en Sistemas de Información (UTN FRM)
🔗 [](#) · 📧 [ludmilareyes208@gmail.com]
