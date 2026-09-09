<?php
/**
 * Plantilla de WordPress: Inicio (Front-Page)
 * Arquitectura: PHP modular + Tailwind CSS JIT (CDN para demo) + Custom Animations
 * Orientada a una adaptación modular de e-commerce, en el futuro
 * Enfoque: B2B Corporativo, UI Moderna, CSS de Alto Rendimiento.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
?>

<!-- CONFIGURACIÓN DE TAILWIND (Theming Dinámico) -->
<!-- En producción, esto se compila vía PostCSS/Vite, aquí se usa script para la demo -->
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    /* Nomenclatura semántica para fácil theaming de marca */
                    brand: {
                        accent: '#E8720C',      /* Naranja corporativo */
                        accentDark: '#C25E09',  
                        primary: '#2A2E38',     /* Azul noche / Navy */
                        secondary: '#3D4250',
                        light: '#ECE9E2',       /* Gris arena claro */
                        lightDark: '#DBD6CB',
                    }
                },
                fontFamily: {
                    display: ['Archivo', 'sans-serif'],
                    body: ['Public Sans', 'sans-serif'],
                },
                animation: {
                    blob: "blob 7s infinite", /* Animación para fondos abstractos */
                },
                keyframes: {
                    blob: {
                        "0%": { transform: "translate(0px, 0px) scale(1)" },
                        "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                        "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                        "100%": { transform: "translate(0px, 0px) scale(1)" },
                    }
                }
            }
        }
    }
</script>
<style type="text/tailwindcss">
    @layer utilities {
        /* Componente de botón geométrico personalizado */
        .clip-btn {
            clip-path: polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%);
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
    }
    .font-body { font-family: 'Public Sans', sans-serif; }
    .font-display { font-family: 'Archivo', sans-serif; }
</style>

<main id="contenido" class="font-body bg-stone-50 text-slate-800 antialiased flex flex-col min-h-screen">

    <!-- HERO SECTION: Glassmorphism & Abstract Shapes -->
    <section class="relative bg-brand-primary text-white overflow-hidden">
        <!-- Abstract Background Beams (Alto rendimiento, sin JS) -->
        <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div class="absolute top-10 -left-10 w-96 h-96 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div class="absolute top-0 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-1/3 w-80 h-80 bg-brand-accentDark rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <!-- Badge -->
                    <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-secondary border border-brand-accent/30 text-brand-accent text-sm font-semibold mb-6 shadow-sm">
                        <span class="flex w-2.5 h-2.5 bg-brand-accent rounded-full mr-2.5 animate-pulse"></span>
                        Soluciones B2B · Infraestructura
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight mb-6">
                        Desarrollamos proyectos y <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-400">abastecemos</span> tu industria.
                    </h1>
                    
                    <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                        Somos especialistas en la ejecución integral de obras de infraestructura y en el abastecimiento mayorista de insumos técnicos para desarrollos a gran escala.
                    </p>
                    
                    <!--  Enlaces dinámicos de WordPress -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <a href="<?php echo esc_url( home_url( '/contacto' ) ); ?>" class="clip-btn bg-brand-accent hover:bg-brand-accentDark text-white font-display font-bold py-4 px-8 text-center transition-all duration-200 transform hover:-translate-y-1 shadow-lg shadow-orange-500/25">
                            Solicitar cotización
                        </a>
                        <a href="<?php echo esc_url( home_url( '/nosotros' ) ); ?>" class="clip-btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary font-display font-bold py-4 px-8 text-center transition-all duration-200 transform hover:-translate-y-1">
                            Conocer la empresa
                        </a>
                    </div>
                    
                    <!-- Trust Indicators -->
                    <div class="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Stock Garantizado
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Logística Propia
                        </div>
                    </div>
                </div>
                
                <!--  Hero Graphic: Composición visual con "Floating UI Cards" -->
                <div class="relative hidden lg:block h-[500px]">
                    <div class="absolute inset-0 bg-gradient-to-tr from-brand-secondary to-brand-primary rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                         <img src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Infraestructura corporativa" class="object-cover w-full h-full opacity-60 mix-blend-overlay">
                         
                         <!-- Floating UI Element 1 (CSS CSS Bounce) -->
                         <div class="absolute top-12 left-[-20px] bg-white text-brand-primary p-4 rounded-xl shadow-xl animate-bounce" style="animation-duration: 3.5s;">
                             <div class="flex items-center gap-3">
                                 <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                 </div>
                                 <div>
                                     <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Avance de Obra</p>
                                     <p class="font-bold text-sm">Ejecución en etapa final</p>
                                 </div>
                             </div>
                         </div>

                         <!-- Floating UI Element 2 -->
                         <div class="absolute bottom-24 right-[-10px] bg-white text-brand-primary p-4 rounded-xl shadow-xl animate-bounce" style="animation-duration: 4.2s; animation-delay: 1s;">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-brand-accent">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Insumos B2B</p>
                                    <p class="font-bold text-sm">Cotización Aprobada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!--  BUSINESS LINES: Tarjetas interactivas con animaciones de hover complejas -->
    <section id="especialidades" class="py-24 bg-white relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <p class="text-brand-accent font-bold tracking-wider uppercase text-sm mb-2">Nuestras Especialidades</p>
                <h2 class="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-4">Múltiples áreas, una sola solución</h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">Dividimos nuestras unidades de negocio estratégicamente para brindarte un nivel de especialización óptimo en cada etapa de tu proyecto.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                
                <!-- Card 1: Desarrollo -->
                <div class="group relative bg-stone-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-accent/50 transition-all duration-300 hover:shadow-2xl flex flex-col">
                    <div class="h-52 overflow-hidden relative">
                        <div class="absolute inset-0 bg-brand-primary/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Desarrollo de proyectos" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    </div>
                    <div class="p-6 relative bg-white flex-1 flex flex-col">
                        <div class="absolute top-0 left-6 w-12 h-1.5 bg-brand-accent transform -translate-y-1/2 rounded-full"></div>
                        <span class="text-brand-accent font-bold text-xs tracking-widest uppercase mb-3 block">01. Ejecución</span>
                        <h3 class="text-xl font-display font-bold text-brand-primary mb-3 group-hover:text-brand-accent transition-colors">Desarrollo Integral</h3>
                        <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            Llevamos adelante obras complejas desde la planificación hasta la entrega llave en mano, garantizando estándares técnicos y tiempos de ejecución.
                        </p>
                        <a href="<?php echo esc_url( home_url( '/servicios/desarrollo' ) ); ?>" class="text-brand-primary font-semibold text-sm inline-flex items-center group-hover:text-brand-accent transition-colors mt-auto">
                            Ver portafolio <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                </div>

                <!-- Card 2: Suministro -->
                <div class="group relative bg-stone-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-accent/50 transition-all duration-300 hover:shadow-2xl flex flex-col">
                    <div class="h-52 overflow-hidden relative">
                        <div class="absolute inset-0 bg-brand-primary/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Insumos industriales" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    </div>
                    <div class="p-6 relative bg-white flex-1 flex flex-col">
                        <div class="absolute top-0 left-6 w-12 h-1.5 bg-brand-accent transform -translate-y-1/2 rounded-full"></div>
                        <span class="text-brand-accent font-bold text-xs tracking-widest uppercase mb-3 block">02. Mayorista</span>
                        <h3 class="text-xl font-display font-bold text-brand-primary mb-3 group-hover:text-brand-accent transition-colors">Suministro B2B</h3>
                        <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            Proveemos materiales técnicos, cableado y equipamiento industrial para compras en volumen. Optimizamos la cadena de suministro de tus proyectos.
                        </p>
                        <a href="<?php echo esc_url( home_url( '/servicios/suministro' ) ); ?>" class="text-brand-primary font-semibold text-sm inline-flex items-center group-hover:text-brand-accent transition-colors mt-auto">
                            Ver catálogo B2B <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                </div>

                <!-- Card 3: Consultoría -->
                <div class="group relative bg-stone-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-accent/50 transition-all duration-300 hover:shadow-2xl flex flex-col">
                    <div class="h-52 overflow-hidden relative">
                        <div class="absolute inset-0 bg-brand-primary/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                        <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Consultoría" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out">
                    </div>
                    <div class="p-6 relative bg-white flex-1 flex flex-col">
                        <div class="absolute top-0 left-6 w-12 h-1.5 bg-brand-accent transform -translate-y-1/2 rounded-full"></div>
                        <span class="text-brand-accent font-bold text-xs tracking-widest uppercase mb-3 block">03. Estrategia</span>
                        <h3 class="text-xl font-display font-bold text-brand-primary mb-3 group-hover:text-brand-accent transition-colors">Consultoría Técnica</h3>
                        <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                            Asesoramiento a medida para corporaciones y profesionales. Evaluamos viabilidad técnica, optimización de recursos y proyecciones de obra.
                        </p>
                        <a href="<?php echo esc_url( home_url( '/contacto' ) ); ?>" class="text-brand-primary font-semibold text-sm inline-flex items-center group-hover:text-brand-accent transition-colors mt-auto">
                            Agendar reunión <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!--  VALUE PROPOSITION -->
    <section class="py-24 bg-brand-light relative z-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="order-2 lg:order-1 relative">
                    <div class="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Infraestructura escalable" class="w-full h-auto object-cover">
                    </div>
                    <!-- Formas geométricas decorativas -->
                    <div class="absolute -bottom-8 -left-8 w-64 h-64 bg-brand-accent rounded-2xl -z-10 opacity-90 hidden md:block"></div>
                    <div class="absolute -top-8 -right-8 w-64 h-64 border-4 border-brand-primary rounded-2xl -z-10 hidden md:block"></div>
                    <div class="absolute top-1/2 -right-12 w-24 h-24 bg-blue-100 rounded-full -z-10 hidden md:block"></div>
                </div>
                
                <div class="order-1 lg:order-2">
                    <p class="text-brand-accent font-bold tracking-wider uppercase text-sm mb-2">Escalabilidad</p>
                    <h2 class="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-6 leading-tight">Infraestructura diseñada para escalar</h2>
                    <p class="text-lg text-gray-700 mb-10 leading-relaxed">
                        Contamos con la capacidad operativa e industrial para soportar desde ejecuciones modulares hasta proyectos corporativos de máxima exigencia técnica.
                    </p>
                    
                    <ul class="space-y-8">
                        <li class="flex items-start">
                            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-brand-accent shadow-sm border border-orange-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div class="ml-5">
                                <h4 class="text-xl font-display font-bold text-brand-primary">Ejecución End-to-End</h4>
                                <p class="mt-2 text-gray-600 leading-relaxed">Nos responsabilizamos de todas las fases del desarrollo, asegurando consistencia y calidad en el resultado final.</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div class="ml-5">
                                <h4 class="text-xl font-display font-bold text-brand-primary">Modelos de Pricing B2B</h4>
                                <p class="mt-2 text-gray-600 leading-relaxed">Estructura de costos dinámica y preferencial por volumen para licitaciones, corporaciones y desarrolladores.</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 shadow-sm border border-green-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div class="ml-5">
                                <h4 class="text-xl font-display font-bold text-brand-primary">Logística Inteligente</h4>
                                <p class="mt-2 text-gray-600 leading-relaxed">Centros de distribución estratégicos y despachos coordinados para sincronizar el abastecimiento con la curva de tu obra.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA / TEASER SECTION -->
    <section class="py-24 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="bg-brand-primary rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                
                <!-- Efectos de iluminación de fondo -->
                <div class="absolute top-0 right-0 w-80 h-80 bg-brand-accentDark rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3"></div>
                <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
                
                <div class="md:w-2/3 mb-10 md:mb-0 relative z-10 pr-0 md:pr-10">
                    <span class="inline-block px-3 py-1 bg-brand-accent/20 text-brand-accent font-bold tracking-wider uppercase text-xs rounded-full mb-4 border border-brand-accent/30">Lanzamiento 2024</span>
                    <h2 class="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Plataforma de E-Procurement B2B</h2>
                    <p class="text-gray-300 text-lg max-w-xl leading-relaxed">
                        Estamos desplegando nuestro portal de compras corporativas. Próximamente podrás gestionar el stock en tiempo real, visualizar líneas de crédito y automatizar tus requerimientos.
                    </p>
                </div>
                
                <div class="md:w-1/3 flex justify-end relative z-10 w-full md:w-auto">
                    <a href="<?php echo esc_url( home_url( '/contacto' ) ); ?>" class="clip-btn bg-brand-accent hover:bg-brand-accentDark text-white font-display font-bold py-5 px-8 text-center transition-all duration-200 w-full md:w-auto flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-500/20">
                        <span>Hablar con ventas</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>
                
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
