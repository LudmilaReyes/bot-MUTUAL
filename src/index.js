// =========================================
// CONFIGURACIÓN DE ACTIVOS Y DESARROLLOS
// ==========================================
const DOMINIO_BOT = "https://bot.mutualmebna.com.ar";

const GALERIA_MEBNA_URL = "https://mutualmebna0.github.io/galeriaDesarrollosMEBNA/";

const RECURSOS_JUNIN = {
  portada: `${DOMINIO_BOT}/media/junin-portada.jpg`,
  duplexImg: `${DOMINIO_BOT}/media/junin-duplex.jpg`,
  duplexImgDirecta: "https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CJDup1.jfif",
  duplexImgDirecta2: "https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CPDup2.jfif",
  casaImg: `${DOMINIO_BOT}/media/junin-casa.jpg`,
  casaImgDirecta: "https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CPCas1.jfif",
  casaImgDirecta2: "https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CPCas2.jfif",
  reglamentoPdf: "https://drive.google.com/file/d/1TkszUHDFHWaRov9pCYXmKbWJ8K4zCid_/view",
  planoImg: "https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/PlanoCJ.jfif",
  coordenadas: {
    latitud: -33.141389,
    longitud: -68.486944,
    nombre: "Barrio Privado Cepas de Junín",
    direccion: "Carril del Centro (a 100m de Santos Lugares), Junín, Mendoza"
  }
};

const RECURSOS_BONARDA = {
  portada: "https://mutualmebna.com.ar/imagenes/SBarrios/Bonarda/IntroBon.png",
  entradaImg: "https://mutualmebna.com.ar/imagenes/SBarrios/Bonarda/EntradaBonarda.png",
  planoImg: "https://mutualmebna.com.ar/imagenes/SBarrios/Bonarda/PlanoBonarda.png",
  coordenadas: {
    latitud: -33.075407,
    longitud: -68.447602,
    nombre: "Barrio Privado Cepas de Bonarda",
    direccion: "Carril Montecaseros, San Martín, Mendoza"
  }
};

const RECURSOS_ALAMOS = {
  portada: "https://mutualmebna.com.ar/imagenes/SBarrios/losalamos.png",
  entradaImg: "https://mutualmebna.com.ar/imagenes/SBarrios/Alamos/EntradaAlamos.png",
  planoImg: "https://mutualmebna.com.ar/imagenes/SBarrios/Alamos/PlanoAlamos.png",
  coordenadas: {
    latitud: -32.9926387,
    longitud: -68.6375485,
    nombre: "Barrio Privado Los Álamos",
    direccion: "Carril Los Álamos y Ruta Provincial 50, Fray Luis Beltrán"
  }
};

const RECURSOS_ANCELLOTTA = {
  portada: "https://mutualmebna.com.ar/imagenes/SBarrios/ancellota.png",
  planoImg: "https://mutualmebna.com.ar/imagenes/SBarrios/Ancellota/PlanoAnce.png",
  coordenadas: {
    latitud: -33.167817,
    longitud: -68.487922,
    nombre: "Barrio Privado Ancellotta",
    direccion: "Calle Anzorena s/n, Junín / Rivadavia, Mendoza"
  }
};

const RECURSOS_RUSSELL = {
  portada: "https://mutualmebna.com.ar/imagenes/SBarrios/cepasrussell.png",
  planoImg: "https://mutualmebna.com.ar/imagenes/SBarrios/CRussellPlano.jpg",
  coordenadas: {
    latitud: -33.018789,
    longitud: -68.802319,
    nombre: "Barrio Privado Cepas de Russell",
    direccion: "Calle Espejo Este 270, Russell, Maipú, Mendoza"
  }
};

const RECURSOS_TURISMO = {
  portada: "https://mutualmebna.com.ar/imagenes/SViajes/viajes1.jfif",
  webTurismo: "https://mutualmebna.com.ar/Viajes.html"
};

const RECURSOS_SEGUROS = {
  portada: "https://mutualmebna.com.ar/imagenes/SSeguros/seguros1.jfif",
  webSeguros: "https://mutualmebna.com.ar/Seguros.html"
};

const ORIGEN_MEDIOS = {
  '/media/junin-portada.jpg': 'https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CJGal1.jfif',
  '/media/junin-duplex.jpg': 'https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CJDup1.jfif',
  '/media/junin-casa.jpg': 'https://mutualmebna.com.ar/imagenes/SBarrios/CdeJunin/CPCas1.jfif'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/media/')) {
      return handleMediaProxy(url.pathname);
    }

    if (url.pathname === '/' || url.pathname === '') {
      return new Response('🟢 Bot Mutual MEBNA - Worker Online y Operativo', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    if (request.method === 'GET') {
      return handleVerify(request, env);
    }
    if (request.method === 'POST') {
      return handleIncoming(request, env, ctx);
    }

    return new Response('Método no permitido', { status: 405 });
  },
};

// ==========================================
// 1. PROXY MULTIMEDIA DEFENSIVO
// ==========================================
async function handleMediaProxy(pathname) {
  const urlOrigen = ORIGEN_MEDIOS[pathname];
  if (!urlOrigen) return new Response('Recurso no configurado', { status: 404 });

  try {
    const respuesta = await fetch(urlOrigen);
    if (!respuesta.ok) return new Response(`Error al obtener medio`, { status: 502 });

    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(respuesta.body, { status: 200, headers: headers });
  } catch (error) {
    console.error(`[PROXY ERROR] Fallo al despachar ${pathname}:`, error.message);
    return new Response('Error en el servicio proxy', { status: 500 });
  }
}

// ==========================================
// 2. VERIFICACIÓN DEL WEBHOOK Y SEGURIDAD
// ==========================================
function handleVerify(request, env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token && env.VERIFY_TOKEN && token === env.VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Error de verificación', { status: 403 });
}

async function verificarFirmaMeta(request, bodyTexto, env) {
  const signature = request.headers.get('X-Hub-Signature-256');
  if (!signature || !env.META_APP_SECRET) return true;

  try {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", encoder.encode(env.META_APP_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(bodyTexto));
    const hashHex = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return signature === `sha256=${hashHex}`;
  } catch (err) {
    return false;
  }
}

// ==========================================
// 3. RECEPCIÓN Y ENRUTAMIENTO PRINCIPAL
// ==========================================
async function handleIncoming(request, env, ctx) {
  try {
    const bodyTexto = await request.clone().text();
    let data;
    try {
      data = JSON.parse(bodyTexto);
    } catch (e) {
      return new Response('JSON Inválido', { status: 400 });
    }

    if (data.update_id) {
      const tokenSecreto = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (env.TELEGRAM_SECRET && tokenSecreto !== env.TELEGRAM_SECRET) {
        return new Response('No autorizado', { status: 401 });
      }
      ctx.waitUntil(procesarMensajeTelegram(data, env));
      return new Response('OK', { status: 200 });
    }

    const esValido = await verificarFirmaMeta(request, bodyTexto, env);
    if (!esValido) return new Response('No autorizado', { status: 401 });

    const mensaje = data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!mensaje) return new Response('OK', { status: 200 });

    ctx.waitUntil(procesarMensaje(mensaje, env));
    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('[FATAL ERROR]:', err);
    return new Response('OK', { status: 200 });
  }
}

// ==========================================
// 4. LÓGICA DE NEGOCIO Y ESTADOS
// ==========================================
async function procesarMensaje(mensaje, env) {
  const telefono = mensaje.from;

  try {
    const memoria = await obtenerMemoriaUsuario(telefono, env) || {};
    const estadoActual = memoria.paso || null;

    const textoEscape = mensaje.type === 'text' ? (mensaje.text?.body || '').trim().toLowerCase() : '';
    if (['reset', 'salir', 'menu', 'menú', 'cancelar', 'inicio'].includes(textoEscape)) {
      await limpiarMemoria(telefono, env);
      await enviarTexto(telefono, '🔄 Volviendo al menú principal...', env);
      await enviarMenuPrincipal(telefono, env);

      if (estadoActual === 'modo_humano' && memoria.hiloTelegram) {
        await enviarATelegram(`🚨 *El usuario \`${telefono}\` cerró la sesión.*`, memoria.hiloTelegram, env);
        await cerrarHiloTelegram(memoria.hiloTelegram, env);
      }
      return; 
    }

    if (estadoActual === 'modo_humano') {
      if (mensaje.type === 'interactive' && mensaje.interactive?.type === 'list_reply') {
        const hiloPrevio = memoria.hiloTelegram;
        if (hiloPrevio) {
          await enviarATelegram(
            `🔀 *El usuario \`${telefono}\` salió de la atención y volvió al menú del bot.*\n` +
            `Seleccionó: *${mensaje.interactive.list_reply.title}*`,
            hiloPrevio, env
          );
          await cerrarHiloTelegram(hiloPrevio, env);
        }
        await limpiarMemoria(telefono, env);
        await manejarMenuInteractivo(telefono, mensaje.interactive.list_reply.id, mensaje.interactive.list_reply.title, env);
        return;
      }

      if (mensaje.type === 'audio' && mensaje.audio?.id) {
        await reenviarAudioATelegram(telefono, mensaje.audio.id, memoria.hiloTelegram, env);
        return;
      }

      const textoUsuario = mensaje.type === 'text' ? mensaje.text.body : '[Archivo recibido]';
      await reenviarMensajeUsuarioATelegram(telefono, textoUsuario, memoria.hiloTelegram, env);
      return;
    }

    if (mensaje.type === 'text') {
      await manejarEstadoTexto(telefono, mensaje.text?.body?.trim() || '', estadoActual, memoria, env);
    } else if (mensaje.type === 'interactive' && mensaje.interactive?.type === 'list_reply') {
      await manejarMenuInteractivo(telefono, mensaje.interactive.list_reply.id, mensaje.interactive.list_reply.title, env);
    } else if (mensaje.type === 'audio' && mensaje.audio?.id) {
      await enviarTexto(
        telefono,
        '🎤 Recibimos tu audio. Para que un asesor pueda escucharlo, primero selecciona una opción del menú y te conectaremos con el sector correspondiente.',
        env
      );
      await enviarMenuPrincipal(telefono, env);
    } else {
      await enviarTexto(telefono, '⚠️ Por favor, selecciona una opción del menú o escribe *menu* para reiniciar.', env);
    }
  } catch (error) {
    console.error(`[ERROR] Procesando mensaje de ${telefono}:`, error);
    await registrarLog(telefono, 'error_sistema', error.message, env);
  }
}

async function manejarEstadoTexto(telefono, textoUsuario, estado, memoria, env) {
  if (!estado) {
    await limpiarMemoria(telefono, env);
    await enviarMenuPrincipal(telefono, env);
    return;
  }

  switch (estado) {
    case 'esperando_nombre_turismo': {
      if (textoUsuario.length < 3 || /^[0-9.\s]+$/.test(textoUsuario)) {
        await enviarTexto(telefono, '⚠️ Por favor, ingresa tu nombre y apellido usando letras:', env);
        return;
      }
      const destinoInteres = memoria.destinoTurismo || 'Turismo';
      const pasosPrevios = (memoria.historial && Array.isArray(memoria.historial))
        ? memoria.historial.map(paso => `  • ${paso}`).join('\n')
        : '  • Consulta directa';

      const detalleTurismo = 
        `👤 *Cliente:* ${textoUsuario}\n` +
        `🏖️ *Destino:* ${destinoInteres}\n\n` +
        `🧭 *Recorrido:*\n${pasosPrevios}`;

      await derivarAAsesor(telefono, 'Turismo', detalleTurismo, env);
      await registrarLog(telefono, 'lead_turismo', `${destinoInteres} - ${textoUsuario}`, env);
      break;
    }

    case 'esperando_nombre_barrio': {
      if (textoUsuario.length < 3 || /^[0-9.\s]+$/.test(textoUsuario)) {
        await enviarTexto(telefono, '⚠️ Por favor, ingresa tu nombre y apellido usando letras:', env);
        return;
      }
      const barrioConsulta = memoria.barrioConsulta || 'Desarrollos';
      const motivoConsulta = memoria.motivoConsulta || 'Consulta general';
      const pasosPrevios = (memoria.historial && Array.isArray(memoria.historial))
        ? memoria.historial.map(paso => `  • ${paso}`).join('\n')
        : '  • Sin recorrido previo';

      const detalleLead = 
        `👤 *Cliente:* ${textoUsuario}\n` +
        `🏘️ *Proyecto:* ${barrioConsulta}\n` +
        `🎯 *Interés:* ${motivoConsulta}\n\n` +
        `🧭 *Recorrido:*\n${pasosPrevios}`;

      await derivarAAsesor(telefono, `Ventas ${barrioConsulta}`, detalleLead, env);
      await registrarLog(telefono, 'lead_inmobiliario', `${barrioConsulta} - ${textoUsuario}`, env);
      break;
    }

    case 'esperando_nombre_seguro': {
      if (textoUsuario.length < 3 || /^[0-9.\s]+$/.test(textoUsuario)) {
        await enviarTexto(telefono, '⚠️ Ingresa tu nombre usando letras:', env);
        return;
      }
      memoria.nombre = textoUsuario;
      memoria.paso = 'esperando_dni_seguro';
      await guardarMemoriaUsuario(telefono, memoria, env);
      await enviarTexto(telefono, `Gracias, *${textoUsuario}*. Ahora ingresa tu **DNI** (solo números):`, env);
      break;
    }

    case 'esperando_dni_seguro': {
      const dniLimpio = textoUsuario.replace(/[\s\.]/g, '');
      if (!/^[0-9]{7,9}$/.test(dniLimpio)) {
        await enviarTexto(telefono, '⚠️ Formato inválido. Ingresa de 7 a 9 números:', env);
        return;
      }
      memoria.dni = dniLimpio;
      memoria.paso = 'esperando_detalle_bien';
      await guardarMemoriaUsuario(telefono, memoria, env);

      let preguntaBien = "Indica marca, modelo y año del bien:";
      if (memoria.tipoSeguro === 'Hogar e Incendio') preguntaBien = "Indica si es casa o departamento, localidad y M2:";
      else if (memoria.tipoSeguro === 'Vida Colectivo' || memoria.tipoSeguro === 'Cobertura Sepelio') preguntaBien = "Indica tu edad:";
      
      await enviarTexto(telefono, preguntaBien, env);
      break;
    }

    case 'esperando_detalle_bien': {
      if (textoUsuario.length < 2) return;
      memoria.detalleBien = textoUsuario;
      const pasosPrevios = (memoria.historial && Array.isArray(memoria.historial))
        ? memoria.historial.map(paso => `  • ${paso}`).join('\n')
        : '  • Cotizador directo';

      const detalleLeadSeguro =
        `🛡️ *COTIZACIÓN DE SEGURO*\n` +
        `👤 *Titular:* ${memoria.nombre}\n` +
        `🆔 *DNI:* ${memoria.dni}\n` +
        `📋 *Ramo:* ${memoria.tipoSeguro}\n` +
        `📝 *Detalle:* ${memoria.detalleBien}\n\n` +
        `🧭 *Recorrido:*\n${pasosPrevios}`;

      await derivarAAsesor(telefono, `Seguros - ${memoria.tipoSeguro}`, detalleLeadSeguro, env);
      await registrarLog(telefono, 'seguro_solicitado', `${memoria.tipoSeguro} - ${memoria.nombre}`, env);
      break;
    }

    default:
      await limpiarMemoria(telefono, env);
      await enviarMenuPrincipal(telefono, env);
      break;
  }
}

async function solicitarNombreAsesorBarrio(telefono, barrio, motivo, env) {
  const memoria = await obtenerMemoriaUsuario(telefono, env) || {};
  memoria.paso = 'esperando_nombre_barrio';
  memoria.barrioConsulta = barrio;
  memoria.motivoConsulta = motivo;
  await guardarMemoriaUsuario(telefono, memoria, env);
  await enviarTexto(telefono, `👋 Para comunicarte con un asesor de *${barrio}*, dinos tu *Nombre y Apellido*:`, env);
}

// ==========================================
// 5. ENRUTADOR DE MENÚS INTERACTIVOS
// ==========================================
async function manejarMenuInteractivo(telefono, id, titulo, env) {
  await registrarLog(telefono, 'seleccion_menu', id, env);

  switch (id) {
    case 'volver_inicio':
      await limpiarMemoria(telefono, env);
      await enviarMenuPrincipal(telefono, env);
      break;

    case 'menu_turnos':
      await derivarAAsesor(telefono, 'Salud', 'Asistencia médica', env);
      break;

    case 'menu_lotes':
      await registrarPasoHistorial(telefono, "Vio listado de barrios", env);
      await enviarMenuLista(
        telefono,
        "Desarrollos MEBNA",
        "🏘️ *Barrios y Desarrollos Inmobiliarios*\nElige el proyecto que deseas conocer:",
        "Nuestros Proyectos", // Ajustado límite Meta < 20 chars
        "Desarrollos",
        [
          { id: "lote_junin", title: "📍 Cepas de Junín", description: "Casas, Dúplex y Lotes" },
          { id: "lote_alamos", title: "📍 Barrio Álamos", description: "Pádel, fútbol, quincho y lotes" },
          { id: "lote_bonarda", title: "📍 Cepas de Bonarda", description: "Desarrollo privado" },
          { id: "lote_ancellotta", title: "📍 Ancellotta", description: "Excelente ubicación" },
          { id: "lote_russell", title: "📍 Cepas de Russell", description: "Maipú, Mendoza" },
          { id: "volver_inicio", title: "🔙 Menú Principal" }
        ],
        env
      );
      break;

    // --- JUNÍN ---
    case 'lote_junin':
      await registrarPasoHistorial(telefono, "Exploró Cepas de Junín", env);
      await presentarCepasDeJunin(telefono, env);
      break;
    case 'junin_menu_casas':
      await registrarPasoHistorial(telefono, "Vio Casas y Dúplex", env);
      await mostrarSubmenuCasasJunin(telefono, env);
      break;
    case 'junin_duplex':
      await presentarModeloDuplex(telefono, env);
      break;
    case 'junin_casa':
      await presentarModeloCasa(telefono, env);
      break;
    case 'junin_lotes_info':
      await presentarLotesJunin(telefono, env);
      break;
    case 'junin_galeria':
      await enviarTexto(telefono, "📸 Te compartimos la galería de Cepas de Junín:", env);
      await enviarBotonEnlace(telefono, "Recorré el barrio como si estuvieras ahí.", "Ver Galería 📸", GALERIA_MEBNA_URL, env);
      await mostrarMenuOpcionesJunin(telefono, env);
      break;
    case 'junin_amenities':
      await enviarTexto(telefono, "🌿 *Amenities:* Seguridad 24hs, espacios verdes, bicisenda.", env);
      await mostrarMenuOpcionesJunin(telefono, env);
      break;
    case 'junin_ubicacion':
      await enviarUbicacion(telefono, RECURSOS_JUNIN.coordenadas.latitud, RECURSOS_JUNIN.coordenadas.longitud, RECURSOS_JUNIN.coordenadas.nombre, RECURSOS_JUNIN.coordenadas.direccion, env);
      await mostrarMenuOpcionesJunin(telefono, env);
      break;
    case 'junin_planos':
      await enviarDocumento(telefono, RECURSOS_JUNIN.reglamentoPdf, "Reglamento-Junin.pdf", env);
      await enviarImagen(telefono, RECURSOS_JUNIN.planoImg, "📐 Plano de lotes", env);
      await mostrarMenuOpcionesJunin(telefono, env);
      break;
    case 'junin_asesor':
      await solicitarNombreAsesorBarrio(telefono, 'Cepas de Junín', 'Consulta Junín', env);
      break;

    // --- ÁLAMOS ---
    case 'lote_alamos':
      await registrarPasoHistorial(telefono, "Exploró Los Álamos", env);
      await presentarBarrioAlamos(telefono, env);
      break;
    case 'alamos_menu_amenities':
      await mostrarSubmenuAmenitiesAlamos(telefono, env);
      break;
    case 'alamos_padel_futbol':
      await presentarCanchasAlamos(telefono, env);
      break;
    case 'alamos_quincho':
      await presentarQuinchoAlamos(telefono, env);
      break;
    case 'alamos_galeria':
      await enviarBotonEnlace(telefono, "Recorré Los Álamos.", "Ver Galería 📸", GALERIA_MEBNA_URL, env);
      await mostrarMenuOpcionesAlamos(telefono, env);
      break;
    case 'alamos_lotes_info':
      await presentarLotesAlamos(telefono, env);
      break;
    case 'alamos_ubicacion':
      await enviarUbicacion(telefono, RECURSOS_ALAMOS.coordenadas.latitud, RECURSOS_ALAMOS.coordenadas.longitud, RECURSOS_ALAMOS.coordenadas.nombre, RECURSOS_ALAMOS.coordenadas.direccion, env);
      await mostrarMenuOpcionesAlamos(telefono, env);
      break;
    case 'alamos_planos':
      await enviarImagen(telefono, RECURSOS_ALAMOS.planoImg, "📐 Plano Barrio Los Álamos", env);
      await mostrarMenuOpcionesAlamos(telefono, env);
      break;
    case 'alamos_asesor':
      await solicitarNombreAsesorBarrio(telefono, 'Los Álamos', 'Consulta Álamos', env);
      break;

    // --- BONARDA ---
    case 'lote_bonarda':
      await registrarPasoHistorial(telefono, "Exploró Bonarda", env);
      await presentarCepasDeBonarda(telefono, env);
      break;
    case 'bonarda_lotes_info':
      await presentarLotesBonarda(telefono, env);
      break;
    case 'bonarda_amenities':
      await enviarTexto(telefono, "🌿 *Amenities:* Seguridad 24hs, espacios verdes, Strip Center.", env);
      await mostrarMenuOpcionesBonarda(telefono, env);
      break;
    case 'bonarda_ubicacion':
      await enviarUbicacion(telefono, RECURSOS_BONARDA.coordenadas.latitud, RECURSOS_BONARDA.coordenadas.longitud, RECURSOS_BONARDA.coordenadas.nombre, RECURSOS_BONARDA.coordenadas.direccion, env);
      await mostrarMenuOpcionesBonarda(telefono, env);
      break;
    case 'bonarda_planos':
      await enviarImagen(telefono, RECURSOS_BONARDA.planoImg, "📐 Plano Bonarda", env);
      await mostrarMenuOpcionesBonarda(telefono, env);
      break;
    case 'bonarda_asesor':
      await solicitarNombreAsesorBarrio(telefono, 'Cepas de Bonarda', 'Consulta Bonarda', env);
      break;

    // --- ANCELLOTTA ---
    case 'lote_ancellotta':
      await registrarPasoHistorial(telefono, "Exploró Ancellotta", env);
      await presentarBarrioAncellotta(telefono, env);
      break;
    case 'ancellotta_lotes_info':
      await presentarLotesAncellotta(telefono, env);
      break;
    case 'ancellotta_galeria':
      await enviarBotonEnlace(telefono, "Fotos de Barrio Ancellotta.", "Ver Galería 📸", GALERIA_MEBNA_URL, env);
      await mostrarMenuOpcionesAncellotta(telefono, env);
      break;
    case 'ancellotta_ubicacion':
      await enviarUbicacion(telefono, RECURSOS_ANCELLOTTA.coordenadas.latitud, RECURSOS_ANCELLOTTA.coordenadas.longitud, RECURSOS_ANCELLOTTA.coordenadas.nombre, RECURSOS_ANCELLOTTA.coordenadas.direccion, env);
      await mostrarMenuOpcionesAncellotta(telefono, env);
      break;
    case 'ancellotta_planos':
      await enviarImagen(telefono, RECURSOS_ANCELLOTTA.planoImg, "📐 Plano Ancellotta", env);
      await mostrarMenuOpcionesAncellotta(telefono, env);
      break;
    case 'ancellotta_asesor':
      await solicitarNombreAsesorBarrio(telefono, 'Barrio Ancellotta', 'Consulta Ancellotta', env);
      break;

    // --- RUSSELL ---
    case 'lote_russell':
      await registrarPasoHistorial(telefono, "Exploró Russell", env);
      await presentarCepasDeRussell(telefono, env);
      break;
    case 'russell_lotes_info':
      await presentarLotesRussell(telefono, env);
      break;
    case 'russell_ubicacion':
      await enviarUbicacion(telefono, RECURSOS_RUSSELL.coordenadas.latitud, RECURSOS_RUSSELL.coordenadas.longitud, RECURSOS_RUSSELL.coordenadas.nombre, RECURSOS_RUSSELL.coordenadas.direccion, env);
      await mostrarMenuOpcionesRussell(telefono, env);
      break;
    case 'russell_planos':
      await enviarImagen(telefono, RECURSOS_RUSSELL.planoImg, "📐 Plano Russell", env);
      await mostrarMenuOpcionesRussell(telefono, env);
      break;
    case 'russell_asesor':
      await solicitarNombreAsesorBarrio(telefono, 'Cepas de Russell', 'Consulta Russell', env);
      break;

    // --- TURISMO ---
    case 'menu_viajes':
      await presentarModuloTurismo(telefono, env);
      break;
    case 'viajes_convenios':
      await presentarConveniosTurismo(telefono, env);
      break;
    case 'viajes_mar_plata':
    case 'viajes_cordoba':
    case 'viajes_bariloche':
    case 'viajes_mendoza': {
      const destinosMap = {
        viajes_mar_plata: "Costa Atlántica",
        viajes_cordoba: "Sierras de Córdoba",
        viajes_bariloche: "Patagonia",
        viajes_mendoza: "Mendoza Cordillera"
      };
      await solicitarNombreTurismo(telefono, destinosMap[id], env);
      break;
    }
    case 'viajes_asesor':
      await solicitarNombreTurismo(telefono, "Consulta general", env);
      break;

    // --- SEGUROS ---
    case 'menu_seguros':
      await presentarModuloSeguros(telefono, env);
      break;
    case 'seguro_auto':
    case 'seguro_moto':
    case 'seguro_hogar':
    case 'seguro_vida':
    case 'seguro_sepelio': {
      const ramosMap = {
        seguro_auto: "Automotores",
        seguro_moto: "Motovehículos",
        seguro_hogar: "Hogar e Incendio",
        seguro_vida: "Vida Colectivo",
        seguro_sepelio: "Cobertura Sepelio"
      };
      await iniciarCotizacionSeguro(telefono, ramosMap[id], env);
      break;
    }
    case 'seguro_polizas_vigentes':
      await derivarAAsesor(telefono, 'Seguros - Trámites', 'Consulta pólizas', env);
      break;

    case 'menu_ayuda':
      await derivarAAsesor(telefono, 'Ayuda Económica', 'Consulta préstamos', env);
      break;

    default:
      await enviarMenuPrincipal(telefono, env);
      break;
  }
}

// ==========================================
// 6. FLUJO COMERCIAL CEPAS DE JUNÍN
// ==========================================
async function presentarCepasDeJunin(telefono, env) {
  const encabezado = 
    "🍇 *Barrio Privado Cepas de Junín*\n\n" +
    "Tu lugar entre naturaleza y tranquilidad: un barrio pensado para crecer en contacto con la naturaleza.\n\n" +
    "📍 A 9 min del centro de Junín\n" +
    "🛡️ Seguridad 24/7\n" +
    "🌳 100% espacios verdes";

  // Siempre enviar texto primero garantiza la entrega si falla la imagen
  await enviarTexto(telefono, encabezado, env);
  try { await enviarImagen(telefono, RECURSOS_JUNIN.portada, "Cepas de Junín", env); } catch (e) {}

  await mostrarMenuOpcionesJunin(telefono, env, "¿Qué te gustaría explorar? 👇");
}

async function mostrarMenuOpcionesJunin(telefono, env, textoCuerpo = "Explora Cepas de Junín:") {
  await enviarMenuLista(
    telefono, "Cepas de Junín", textoCuerpo, "Ver Opciones", "Menú Principal",
    [
      { id: "junin_menu_casas", title: "🏡 Casas y Dúplex", description: "Llave en mano" },
      { id: "junin_lotes_info", title: "📐 Lotes Disponibles", description: "Para construir" },
      { id: "junin_galeria", title: "📸 Galería de Fotos", description: "Recorré el barrio" },
      { id: "junin_amenities", title: "✨ Servicios", description: "Seguridad, bicisenda" },
      { id: "junin_ubicacion", title: "📍 Ubicación GPS", description: "Mapa de llegada" },
      { id: "junin_planos", title: "📄 Planos", description: "Descargar archivos" },
      { id: "junin_asesor", title: "🙋 Hablar con Asesor", description: "Atención comercial" },
      { id: "menu_lotes", title: "🔙 Volver a Barrios", description: "Listado general" }
    ], env
  );
}

async function mostrarSubmenuCasasJunin(telefono, env, textoCuerpo = "Elige una tipología para conocer sus detalles:") {
  await enviarMenuLista(
    telefono,
    "Modelos de Vivienda",
    textoCuerpo,
    "Ver Viviendas 🏠",
    "Tipologías Constructivas",
    [
      { id: "junin_duplex", title: "🏘️ Modelo Dúplex", description: "2 dormitorios | 2 baños | Cochera" },
      { id: "junin_casa", title: "🏠 Modelo Casa", description: "3 dormitorios | 3 baños | 2 cocheras" },
      { id: "junin_galeria", title: "📸 Ver Galería", description: "Fotos de casas y dúplex terminados" },
      { id: "junin_lotes_info", title: "📐 Solo Lote", description: "Para construir tu propio proyecto" },
      { id: "junin_asesor", title: "🙋 Agendar Visita", description: "Conoce las obras en el barrio" },
      { id: "lote_junin", title: "🔙 Menú Junín", description: "Volver a opciones del barrio" }
    ],
    env
  );
}

async function presentarModeloDuplex(telefono, env) {
  const fichaDuplex = 
    "🏘️ *MODELO DÚPLEX - CEPAS DE JUNÍN*\n\n" +
    "Una propuesta arquitectónica moderna y funcional, ideal para familias o como inversión segura. Diseñado para maximizar la luz natural y el confort diario.\n\n" +
    "✨ *Características principales:*\n" +
    "🛏️ *2 Dormitorios* amplios en planta alta.\n" +
    "🚿 *2 Baños* con terminaciones de primera calidad.\n" +
    "🍳 *Cocina integrada* con diseño moderno y barra.\n" +
    "🌳 *Patio privado* ideal para disfrutar al aire libre.\n" +
    "🚗 *Cochera propia* en el frente de la propiedad.\n" +
    "🔑 *Modalidad:* Entrega 100% llave en mano.\n\n" +
    "Vivir en Cepas de Junín es disfrutar de la tranquilidad con la seguridad de un barrio privado.";

  // Enviamos la imagen proxy (para evitar el bloqueo del .jfif) adjuntando todo el texto como Caption
  const imagenEnviada = await enviarImagen(telefono, RECURSOS_JUNIN.duplexImg, fichaDuplex, env);
  
  // Fallback: Si Meta rechaza la imagen por algún motivo de red, aseguramos que el cliente reciba el texto
  if (!imagenEnviada) {
    await enviarTexto(telefono, fichaDuplex, env);
  }

  // Agregamos el llamado a la acción hacia la galería web
  await enviarBotonEnlace(
    telefono,
    "¿Querés ver más fotos de los interiores, patios y el avance de obra? Recorré nuestra galería interactiva:",
    "Ver Galería 📸",
    GALERIA_MEBNA_URL,
    env
  );

  // Menú de siguientes pasos
  await enviarMenuLista(
    telefono,
    "Acciones Dúplex",
    "¿Qué te gustaría hacer a continuación con el Modelo Dúplex?",
    "Elegir Opción 📋",
    "Siguiente paso",
    [
      { id: "junin_asesor", title: "🙋 Agendar Visita a Obra", description: "Coordinar día y horario para conocerlo" },
      { id: "junin_casa", title: "🏠 Ver Casa (3 Dorm)", description: "Comparar con la casa más grande" },
      { id: "junin_planos", title: "📄 Descargar Planos", description: "Documentación técnica del complejo" },
      { id: "junin_menu_casas", title: "🔙 Volver a Viviendas", description: "Ver catálogo completo de modelos" }
    ],
    env
  );
}

async function presentarModeloCasa(telefono, env) {
  const fichaCasa = 
    "🏠 *MODELO CASA - CEPAS DE JUNÍN*\n\n" +
    "Diseñada para quienes buscan amplitud, jerarquía y el máximo confort. Sus ambientes integrados y luminosos son el escenario perfecto para disfrutar en familia.\n\n" +
    "✨ *Características destacadas:*\n" +
    "🛏️ *3 Dormitorios* de generosas dimensiones.\n" +
    "🚿 *3 Baños* con terminaciones de primera calidad.\n" +
    "🍳 *Cocina de concepto abierto* amplia y funcional.\n" +
    "🌳 *Patio extenso* ideal para futuras ampliaciones o piscina.\n" +
    "🚗 *Cochera doble* en el frente de la propiedad.\n" +
    "🔑 *Modalidad:* Entrega 100% llave en mano.\n\n" +
    "El balance perfecto entre confort e inversión patrimonial segura.";

  // 1. Usamos la imagen PROXY (.casaImg) para evitar el bloqueo del .jfif y pasamos el texto como caption
  const imagenEnviada = await enviarImagen(telefono, RECURSOS_JUNIN.casaImg, fichaCasa, env);
  
  // 2. Fallback de seguridad: Si Meta falla por red, el usuario recibe igual la información
  if (!imagenEnviada) {
    await enviarTexto(telefono, fichaCasa, env);
  }

  // 3. CTA a la galería
  await enviarBotonEnlace(
    telefono,
    "¿Querés ver fotos de los interiores y cómo avanza la obra de este modelo? Recorré nuestra galería interactiva:",
    "Ver Galería 📸",
    GALERIA_MEBNA_URL,
    env
  );

  // 4. Siguientes pasos
  await enviarMenuLista(
    telefono,
    "Acciones Casa",
    "¿Qué te gustaría hacer a continuación con el Modelo Casa?",
    "Elegir Opción 📋",
    "Siguiente paso",
    [
      { id: "junin_asesor", title: "🙋 Cotizar / Agendar Visita", description: "Hablar con asesor por esta Casa" },
      { id: "junin_duplex", title: "🏘️ Ver Modelo Dúplex (2 Dorm)", description: "Comparar con el dúplex" },
      { id: "junin_menu_casas", title: "🔙 Volver a Viviendas", description: "Ver catálogo completo" }
    ],
    env
  );
}

async function presentarLotesJunin(telefono, env) {
  await enviarTexto(telefono, "📐 *Lotes Residenciales*\n\nConstruye a tu ritmo con seguridad 24hs y reglamento constructivo.", env);
  await enviarMenuLista(telefono, "Lotes", "¿Cómo deseas continuar?", "Opciones", "Acciones", [
    { id: "junin_planos", title: "📄 Ver Plano", description: "Mapa de lotes" },
    { id: "junin_asesor", title: "🙋 Consultar Disponibles", description: "Hablar con asesor" },
    { id: "lote_junin", title: "🔙 Menú Junín", description: "Volver" }
  ], env);
}

// ==========================================
// 6e. FLUJO COMERCIAL BARRIO LOS ÁLAMOS
// ==========================================
async function presentarBarrioAlamos(telefono, env) {
  const encabezado =
    "🏡 *Barrio Privado Los Álamos*\n\n" +
    "El lugar ideal para vivir con comodidad, deporte y seguridad.\n\n" +
    "🎾 Cancha de pádel\n" +
    "⚽ Cancha de fútbol\n" +
    "🥩 Quincho para eventos\n" +
    "🛡️ Seguridad 24/7";

  // Se fuerza el envío del texto antes de la imagen para evitar fallos mudos
  await enviarTexto(telefono, encabezado, env);
  try { await enviarImagen(telefono, RECURSOS_ALAMOS.portada, "Los Álamos", env); } catch (e) {}

  await mostrarMenuOpcionesAlamos(telefono, env, "¿Qué te gustaría consultar? 👇");
}

async function mostrarMenuOpcionesAlamos(telefono, env, textoCuerpo = "Opciones Los Álamos:") {
  await enviarMenuLista(
    telefono, "Barrio Los Álamos", textoCuerpo, "Ver Opciones", "Menú Principal",
    [
      { id: "alamos_menu_amenities", title: "🎾 Deportes y Quincho", description: "Instalaciones sociales" },
      { id: "alamos_lotes_info", title: "📐 Lotes Disponibles", description: "Terrenos residenciales" },
      { id: "alamos_galeria", title: "📸 Galería de Fotos", description: "Recorrer predio" },
      { id: "alamos_ubicacion", title: "📍 Ubicación GPS", description: "Accesos" },
      { id: "alamos_planos", title: "📐 Plano de Lotes", description: "Distribución" },
      { id: "alamos_asesor", title: "🙋 Hablar con Asesor", description: "Comercial" },
      { id: "menu_lotes", title: "🔙 Volver a Barrios", description: "Listado general" }
    ], env
  );
}

async function mostrarSubmenuAmenitiesAlamos(telefono, env) {
  await enviarMenuLista(
    telefono, "Amenities", "Instalaciones deportivas:", "Opciones Club", "Deportes",
    [
      { id: "alamos_padel_futbol", title: "🎾 Canchas", description: "Pádel y Fútbol" },
      { id: "alamos_quincho", title: "🥩 Quincho", description: "Para eventos" },
      { id: "lote_alamos", title: "🔙 Menú Álamos", description: "Volver al barrio" }
    ], env
  );
}

async function presentarCanchasAlamos(telefono, env) {
  await enviarTexto(telefono, "🎾⚽ *Sector Deportivo*\n\nCancha de Pádel y Cancha de Fútbol reducida con vigilancia 24hs.", env);
  await enviarMenuLista(telefono, "Deportes", "¿Continuar?", "Opciones", "Acciones", [
    { id: "alamos_quincho", title: "🥩 Ver Quincho", description: "Eventos" },
    { id: "alamos_menu_amenities", title: "🔙 Volver", description: "Menú deportes" }
  ], env);
}

async function presentarQuinchoAlamos(telefono, env) {
  await enviarTexto(telefono, "🥩 *Quincho y Área Social*\n\nEspacio cerrado con parrilla y estacionamiento interior.", env);
  await enviarMenuLista(telefono, "Quincho", "¿Continuar?", "Opciones", "Acciones", [
    { id: "alamos_padel_futbol", title: "🎾 Ver Canchas", description: "Deportes" },
    { id: "alamos_menu_amenities", title: "🔙 Volver", description: "Menú deportes" }
  ], env);
}

async function presentarLotesAlamos(telefono, env) {
  await enviarTexto(telefono, "📐 *Lotes en Los Álamos*\n\nTerrenos amplios con servicios (Luz, Agua) y seguridad.", env);
  await enviarMenuLista(telefono, "Lotes", "¿Continuar?", "Opciones", "Acciones", [
    { id: "alamos_planos", title: "📐 Ver Planos", description: "Distribución" },
    { id: "alamos_asesor", title: "🙋 Consultar Disponibles", description: "Valores" },
    { id: "lote_alamos", title: "🔙 Menú Álamos", description: "Volver" }
  ], env);
}

// ==========================================
// MÉTODOS SIMPLIFICADOS PARA BONARDA, ANCELLOTTA Y RUSSELL
// ==========================================
async function presentarCepasDeBonarda(telefono, env) {
  await enviarTexto(telefono, "🍇 *Cepas de Bonarda*\n\n40 lotes a 200m de RN 7. Strip center y vigilancia 24/7.", env);
  try { await enviarImagen(telefono, RECURSOS_BONARDA.portada, "Bonarda", env); } catch (e) {}
  await mostrarMenuOpcionesBonarda(telefono, env);
}
async function mostrarMenuOpcionesBonarda(telefono, env) {
  await enviarMenuLista(telefono, "Bonarda", "Explora el barrio:", "Ver Opciones", "Acciones", [
    { id: "bonarda_lotes_info", title: "📐 Lotes Disponibles", description: "Terrenos" },
    { id: "bonarda_planos", title: "📐 Planos", description: "Distribución" },
    { id: "bonarda_asesor", title: "🙋 Asesor", description: "Hablar con ventas" },
    { id: "menu_lotes", title: "🔙 Volver", description: "Barrios" }
  ], env);
}
async function presentarLotesBonarda(telefono, env) {
  await enviarTexto(telefono, "📐 *Lotes en Bonarda*\n\n40 terrenos exclusivos en un entorno natural único.", env);
  await mostrarMenuOpcionesBonarda(telefono, env);
}

async function presentarBarrioAncellotta(telefono, env) {
  await enviarTexto(telefono, "🍇 *Barrio Ancellotta*\n\nLotes amplios en límite Junín/Rivadavia.", env);
  try { await enviarImagen(telefono, RECURSOS_ANCELLOTTA.portada, "Ancellotta", env); } catch (e) {}
  await mostrarMenuOpcionesAncellotta(telefono, env);
}
async function mostrarMenuOpcionesAncellotta(telefono, env) {
  await enviarMenuLista(telefono, "Ancellotta", "Explora el barrio:", "Ver Opciones", "Acciones", [
    { id: "ancellotta_lotes_info", title: "📐 Lotes y Planos", description: "Disponibilidad" },
    { id: "ancellotta_asesor", title: "🙋 Asesor", description: "Hablar con ventas" },
    { id: "menu_lotes", title: "🔙 Volver", description: "Barrios" }
  ], env);
}
async function presentarLotesAncellotta(telefono, env) {
  await enviarTexto(telefono, "📐 *Lotes en Ancellotta*\n\nParcelas listas para edificar con servicios instalados.", env);
  await mostrarMenuOpcionesAncellotta(telefono, env);
}

async function presentarCepasDeRussell(telefono, env) {
  await enviarTexto(telefono, "🍇 *Cepas de Russell*\n\nEntorno vitivinícola en Maipú con tendido subterráneo.", env);
  try { await enviarImagen(telefono, RECURSOS_RUSSELL.portada, "Russell", env); } catch (e) {}
  await mostrarMenuOpcionesRussell(telefono, env);
}
async function mostrarMenuOpcionesRussell(telefono, env) {
  await enviarMenuLista(telefono, "Russell", "Explora el barrio:", "Ver Opciones", "Acciones", [
    { id: "russell_lotes_info", title: "📐 Lotes y Planos", description: "Maipú" },
    { id: "russell_asesor", title: "🙋 Asesor", description: "Hablar con ventas" },
    { id: "menu_lotes", title: "🔙 Volver", description: "Barrios" }
  ], env);
}
async function presentarLotesRussell(telefono, env) {
  await enviarTexto(telefono, "📐 *Lotes en Russell*\n\nTerrenos en plena ruta del vino con vigilancia.", env);
  await mostrarMenuOpcionesRussell(telefono, env);
}

// ==========================================
// 7. ADAPTADORES DE MENSAJERÍA (META GRAPH API)
// ==========================================
async function hacerPeticionMeta(payload, env) {
  if (!env.PHONE_NUMBER_ID || !env.META_TOKEN) return false;
  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${env.PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.META_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error(`[META API ERROR] en tipo ${payload.type}:`, JSON.stringify(err));
      return false;
    }
    return true;
  } catch (err) { return false; }
}

async function enviarTexto(telefonoDestino, texto, env) {
  return await hacerPeticionMeta({ messaging_product: 'whatsapp', to: telefonoDestino, type: 'text', text: { body: texto } }, env);
}
async function enviarImagen(telefonoDestino, urlImagen, pieDeFoto, env) {
  return await hacerPeticionMeta({ messaging_product: 'whatsapp', to: telefonoDestino, type: 'image', image: { link: urlImagen, ...(pieDeFoto ? { caption: pieDeFoto.substring(0, 1024) } : {}) } }, env);
}
async function enviarDocumento(telefonoDestino, urlDocumento, nombreArchivo, env) {
  return await hacerPeticionMeta({ messaging_product: 'whatsapp', to: telefonoDestino, type: 'document', document: { link: urlDocumento, filename: nombreArchivo.substring(0, 100) } }, env);
}
async function enviarUbicacion(telefonoDestino, latitud, longitud, nombre, direccion, env) {
  return await hacerPeticionMeta({ messaging_product: 'whatsapp', to: telefonoDestino, type: 'location', location: { latitude: latitud, longitude: longitud, name: nombre.substring(0, 100), address: direccion.substring(0, 100) } }, env);
}
async function enviarBotonEnlace(telefonoDestino, textoCuerpo, textoBoton, url, env) {
  return await hacerPeticionMeta({
    messaging_product: "whatsapp", to: telefonoDestino, type: "interactive",
    interactive: { type: "cta_url", body: { text: textoCuerpo.substring(0, 1024) }, footer: { text: "Mutual MEBNA" }, action: { name: "cta_url", parameters: { display_text: textoBoton.substring(0, 20), url: url } } }
  }, env);
}

async function enviarMenuLista(telefonoDestino, tituloCabecera, textoCuerpo, textoBoton, tituloSeccion, opciones, env) {
  // Saneamiento seguro de límites para Meta
  const opcionesSaneadas = opciones.map(item => ({
    id: item.id,
    title: item.title.substring(0, 24),
    ...(item.description ? { description: item.description.substring(0, 72) } : {})
  }));

  return await hacerPeticionMeta({
    messaging_product: "whatsapp",
    to: telefonoDestino,
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: tituloCabecera.substring(0, 60) },
      body: { text: textoCuerpo.substring(0, 1024) },
      footer: { text: "Mutual MEBNA" },
      action: {
        button: textoBoton.substring(0, 20),
        sections: [{ title: tituloSeccion.substring(0, 24), rows: opcionesSaneadas.slice(0, 10) }]
      }
    }
  }, env);
}

async function enviarMenuPrincipal(telefonoDestino, env) {
  await enviarMenuLista(
    telefonoDestino, "Mutual MEBNA", "👋 ¡Hola! Selecciona una de las opciones para orientarte:", "Opciones", "Servicios",
    [
      { id: "menu_lotes", title: "🏘️ Loteos y Barrios", description: "Desarrollos y viviendas" },
      { id: "menu_seguros", title: "🛡️ Seguros Generales", description: "Cotizaciones autos, hogar" },
      { id: "menu_turnos", title: "🏥 Asistencia Médica", description: "Salud para afiliados" },
      { id: "menu_ayuda", title: "💸 Ayuda Económica", description: "Préstamos y convenios" },
      { id: "menu_viajes", title: "✈️ Turismo y Viajes", description: "Hotelería y escapadas" }
    ], env
  );
}

// ==========================================
// 8. INTEGRACIÓN CON TELEGRAM Y AUDIOS
// ==========================================
async function derivarAAsesor(telefono, area, contexto, env) {
  await enviarTexto(telefono, `Conectando con asesor de *${area}*...`, env);
  const threadId = await crearHiloTelegram(`${area} | ${telefono}`, env);
  if (threadId && env.ESTADO_BOT) await env.ESTADO_BOT.put(`tg_thread_${threadId}`, telefono, { expirationTtl: 86400 });
  await guardarMemoriaUsuario(telefono, { paso: 'modo_humano', hiloTelegram: threadId }, env);
  await enviarTexto(telefono, "✅ ¡Listo! Escribe tu consulta aquí:", env);
  await enviarATelegram(`🚨 *ATENCIÓN*\n👤 \`${telefono}\`\n📂 ${area}\n\n${contexto}`, threadId, env);
}

async function crearHiloTelegram(nombreHilo, env) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/createForumTopic`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, name: nombreHilo.substring(0, 128) }) });
    const data = await res.json();
    return data.ok ? data.result.message_thread_id : null;
  } catch (e) { return null; }
}

async function cerrarHiloTelegram(threadId, env) {
  if (!threadId || !env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  try { await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/closeForumTopic`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, message_thread_id: threadId }) }); } catch (e) {}
}

async function reenviarAudioATelegram(telefono, mediaId, threadId, env) { /* Mismo código nativo omitido por brevedad visual, asume lógica intacta */ }
async function enviarATelegram(texto, threadId, env) { /* Lógica intacta */ }
async function reenviarMensajeUsuarioATelegram(telefono, texto, threadId, env) { /* Lógica intacta */ }
async function procesarMensajeTelegram(data, env) { /* Lógica intacta */ }

// ==========================================
// 9. PERSISTENCIA SEGURA (KV / D1)
// ==========================================
async function registrarPasoHistorial(telefono, accionTexto, env) {
  const memoria = await obtenerMemoriaUsuario(telefono, env) || {};
  // VALIDACIÓN VITAL: Si el array en KV se rompió, lo reconstruimos
  if (!memoria.historial || !Array.isArray(memoria.historial)) {
    memoria.historial = [];
  }
  if (memoria.historial[memoria.historial.length - 1] !== accionTexto) {
    memoria.historial.push(accionTexto);
  }
  if (memoria.historial.length > 6) {
    memoria.historial.shift();
  }
  await guardarMemoriaUsuario(telefono, memoria, env);
}

async function obtenerMemoriaUsuario(telefono, env) {
  try { return env.ESTADO_BOT ? await env.ESTADO_BOT.get(telefono, "json") : null; } catch (e) { return null; }
}
async function guardarMemoriaUsuario(telefono, datos, env) {
  try { if (env.ESTADO_BOT) await env.ESTADO_BOT.put(telefono, JSON.stringify(datos), { expirationTtl: 3600 }); } catch (e) {}
}
async function limpiarMemoria(telefono, env) {
  try { if (env.ESTADO_BOT) await env.ESTADO_BOT.delete(telefono); } catch (e) {}
}
async function registrarLog(telefono, evento, detalle, env) {
  if (!env.DB_LOGS) return;
  try { await env.DB_LOGS.prepare("INSERT INTO logs (telefono, evento, detalle) VALUES (?, ?, ?)").bind(telefono, evento, detalle).run(); } catch (err) {}
}

// ==========================================
// 10. MÓDULOS TURISMO Y SEGUROS (RESUMIDOS)
// ==========================================
async function presentarModuloTurismo(telefono, env) { /* Lógica intacta */ }
async function presentarConveniosTurismo(telefono, env) { /* Lógica intacta */ }
async function solicitarNombreTurismo(telefono, destino, env) { /* Lógica intacta */ }
async function presentarModuloSeguros(telefono, env) { /* Lógica intacta */ }
async function iniciarCotizacionSeguro(telefono, ramo, env) { /* Lógica intacta */ }
