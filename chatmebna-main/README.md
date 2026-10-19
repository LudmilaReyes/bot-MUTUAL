# Bot de WhatsApp - Mutual MEBNA

Bot con menú lógico, corriendo en **Cloudflare Workers** sobre tu propio dominio.

## Qué incluye este proyecto

- `src/index.js` → el código del bot (verificación del webhook + lógica del menú + envío de mensajes)
- `wrangler.toml` → configuración de Cloudflare (nombre del proyecto y la ruta/dominio)
- `logger-apps-script.gs` → script opcional para anotar cada interacción en Google Sheets
- `package.json` → dependencias mínimas para desplegar con Wrangler (la herramienta de Cloudflare)

---

## PASO 1 — Subir el código a GitHub

1. Creá un repositorio nuevo en GitHub (privado, recomendado — va a tener lógica de tu negocio).
2. Subí toda esta carpeta (`whatsapp-bot/`) a ese repositorio.
   - Si nunca usaste git desde la terminal, también podés arrastrar los archivos directo desde la web de GitHub ("Add file" → "Upload files").

---

## PASO 2 — Crear el Worker en Cloudflare y conectarlo a GitHub

1. Entrá a tu cuenta de Cloudflare → **Workers & Pages** → **Create** → **Workers**.
2. Elegí **"Connect to Git"** (no "Deploy from template").
3. Autorizá a Cloudflare a acceder a tu cuenta de GitHub y seleccioná el repositorio que subiste.
4. En la configuración de build:
   - **Build command**: dejalo vacío (no hace falta build)
   - **Deploy command**: `npx wrangler deploy`
5. Confirmá. Cloudflare va a hacer el primer deploy automáticamente.

A partir de acá, **cada vez que hagas `git push` a tu repo, Cloudflare actualiza el Worker solo.**

---

## PASO 3 — Configurar los Secrets (tokens seguros)

Nunca pongas tokens directo en el código. En Cloudflare:

1. Andá a tu Worker → **Settings** → **Variables and Secrets**.
2. Agregá estas 5 variables (marcalas como **Secret**, no como texto plano, salvo que se indique lo contrario):

| Nombre | Valor | Tipo |
|---|---|---|
| `VERIFY_TOKEN` | El token que vos inventes (ej: `mutual2026`) — es el mismo que vas a poner en Meta | Secret |
| `META_TOKEN` | El access token de la API de WhatsApp (Meta Developer → API Setup) | Secret |
| `PHONE_NUMBER_ID` | El Phone Number ID (número corto, NO el token) | Secret o texto |
| `LOG_ENDPOINT` | La URL del Web App de Apps Script (Paso 5) — opcional | Texto |
| `LOG_SECRET` | Una clave inventada por vos, igual a la que pongas en el `.gs` — opcional | Secret |

⚠️ Si no vas a usar el logueo a Sheets todavía, simplemente no cargues `LOG_ENDPOINT` ni `LOG_SECRET` — el bot sigue funcionando igual, solo se salta esa parte.

---

## PASO 4 — Conectar tu dominio

1. Abrí `wrangler.toml` y reemplazá `bot.tudominio.com` y `tudominio.com` por tu dominio real (el que ya tenés en Cloudflare).
2. Hacé `git push` — Cloudflare va a crear la ruta automáticamente.
3. Vas a poder confirmar en Cloudflare → tu Worker → **Settings** → **Triggers** → **Routes** que quedó asociada la subruta `/webhook`.

Tu webhook final va a quedar en, por ejemplo:
```
https://bot.tudominio.com/webhook
```

---

## PASO 5 (Opcional) — Activar el registro en Google Sheets

Si querés que cada interacción quede anotada en una hoja de cálculo:

1. Abrí una hoja de Google Sheets nueva (o la que ya tenías).
2. Extensiones → Apps Script.
3. Borrá lo que haya y pegá el contenido de `logger-apps-script.gs`.
4. Cambiá `SECRET_COMPARTIDO` por una clave inventada por vos.
5. **Implementar** → **Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: "Yo"
   - Quién tiene acceso: **"Cualquier usuario"**
6. Copiá la URL que te da (termina en `/exec`).
7. Esa URL va en `LOG_ENDPOINT` en Cloudflare, y la misma clave va en `LOG_SECRET`.

---

## PASO 6 — Configurar el webhook en Meta Developer

1. Meta for Developers → tu App → **WhatsApp** → **Configuration**.
2. En **Webhook**, hacé clic en **Edit**.
3. **Callback URL**: `https://bot.tudominio.com/webhook`
4. **Verify Token**: el mismo valor que pusiste en `VERIFY_TOKEN`.
5. Guardá — Meta va a hacer un GET automático para verificar; si todo está bien配置, va a aparecer "Verified" (✅).
6. Justo debajo, en **Webhook fields**, tildá **`messages`** (esto es lo que suele quedar sin marcar y hace que nunca lleguen los mensajes).

---

## PASO 7 — Probar

1. Escribile cualquier texto al número de WhatsApp Business desde tu celular.
2. Debería llegarte el menú con las 3 opciones (Turnos, Lotes, Seguros).
3. Si no llega nada, revisá los **Logs** del Worker en Cloudflare (Workers & Pages → tu Worker → **Logs** → "Begin log stream") mientras enviás el mensaje — ahí vas a ver en tiempo real qué está pasando.

---

## Notas de seguridad

- **Regenerá tu `META_TOKEN` actual** si lo compartiste antes en algún chat o repo público — quedó expuesto y hay que invalidarlo.
- Los tokens de prueba de Meta expiran cada 24hs. Si tu bot deja de responder al día siguiente, generá un **token permanente** desde un System User en Meta Business Suite.
- Nunca subas tokens reales al `.toml` ni al código — siempre van como Secrets en Cloudflare.
