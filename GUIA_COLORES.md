# 🎨 GUÍA DE COLORES - PALETA TURQUESA PROFESIONAL

## ✨ Sistema 100% Centralizado

**NUNCA más necesitarás cambiar colores pantalla por pantalla.**  
Todo está en **2 archivos únicos**: `tailwind.config.js` y `src/index.css`

---

## 🌊 Paleta Actual

### Color Principal - Turquesa Suave
```
#8CB1B9 - rgb(140, 177, 185)
```
- ✅ Uso: Botones principales, títulos, iconos, estadísticas, fechas/metadatos
- ✅ Hover: #6A9AA5 (más oscuro)
- ❌ NO combinar con #D1D7D7 (se opaca)

### Bordes y Separadores
```
#D1D7D7 - rgb(209, 215, 215)
```
- ✅ Uso: Bordes de cards, separadores, inputs
- ✅ Botones secundarios (cuando SÍ hay jerarquía)

### Fondo Principal
```
#FFFFFF - rgb(255, 255, 255)
```
- ✅ Fondo de TODA la aplicación
- ✅ Fondo de tarjetas/cards
- ❌ NO usar otros fondos de color

### Textos
```
#333333 - Texto principal (títulos, párrafos importantes)
#666666 - Texto secundario (descripciones, subtítulos)
#999999 - Texto terciario (placeholders, metadatos)
```

---

## 🎯 Sistema de Botones

### SIN Jerarquía (ambas opciones igual de importantes)
**Ejemplo: "Estudiantes" vs "Empresas" - MISMA importancia**

```jsx
// Opción 1 - Sólido
<Button variant="primary">Soy Estudiante</Button>

// Opción 2 - Outline (NO es secundario, es igual)
<Button variant="primary-outline">Soy Empresa</Button>
```

### CON Jerarquía (una opción es más importante)
**Ejemplo: "Guardar" (principal) vs "Cancelar" (secundario)**

```jsx
// Acción principal
<Button variant="primary">Guardar Cambios</Button>

// Acción secundaria (menos importante)
<Button variant="secondary">Cancelar</Button>
```

---

## 📐 Reglas de Diseño

### Border Radius
- ✅ Máximo: **5px**
- ✅ Por defecto: **4px**
- ❌ NO usar border-radius mayores a 5px

### Bordes
- Normal: **2px**
- Separadores importantes (header/footer): **3px**

### Espaciado
- Entre secciones: **40px mínimo**
- Padding en cards: **40px**
- Gap entre cards: **20px**
- Padding botones: **16px vertical, 45px horizontal**

### Tipografía
```css
h1: 3.25rem, font-weight: 700
h2: 2.65rem, font-weight: 700
h3: 1.35rem, font-weight: 600
Botones: 1.1rem, font-weight: 600
Texto normal: 1rem, line-height: 1.6-1.7
```

---

## 🎨 Clases CSS Disponibles

### Botones
```jsx
<button className="btn-primary">Primario Sólido</button>
<button className="btn-primary-outline">Primario Outline</button>
<button className="btn-secondary">Secundario (jerárquicamente menor)</button>
<button className="btn-sm">Botón Pequeño</button>
```

### Cards
```jsx
<div className="card">
  Contenido con hover effect automático
</div>
```

### Inputs
```jsx
<input className="input-field" placeholder="Email" />
```

### Enlaces
```jsx
<a href="#" className="link-primary">Enlace turquesa</a>
```

### Layouts
```jsx
<div className="container-main">
  Máximo 1200px, centrado
</div>

<section className="section-spacing">
  40px padding vertical
</section>
```

### Elementos Especiales
```jsx
<span className="stat-number">5,000+</span>
<span className="badge-primary">Nuevo</span>
<span className="date-meta">2024-12-01</span>
<div className="icon-circle">🎓</div>
```

### Header y Footer
```jsx
<header>
  <!-- Automáticamente tiene borde inferior turquesa 3px -->
</header>

<footer>
  <!-- Automáticamente tiene borde superior turquesa 3px -->
  <h3>Título en turquesa</h3>
</footer>
```

### Hero/Banner
```jsx
<div className="hero-gradient">
  <!-- Gradiente turquesa automático -->
</div>
```

---

## 🔧 Cómo Cambiar TODA la Paleta

### Método 1: Tailwind (Recomendado)

Abre: `tailwind.config.js`

```javascript
primary: {
  400: '#8CB1B9',  // ← Cambia este color
  500: '#8CB1B9',  // ← Y este
  600: '#6A9AA5',  // ← Color hover
}
```

### Método 2: Variables CSS

Abre: `src/index.css`

```css
:root {
  --color-primary: 140 177 185;        /* ← Cambia RGB aquí */
  --color-primary-hover: 106 154 165;  /* ← Hover */
  --color-border: 209 215 215;         /* ← Bordes */
  --color-text-primary: 51 51 51;      /* ← Texto */
}
```

---

## ❌ LO QUE NO DEBES HACER

1. ❌ Border-radius mayores a 5px
2. ❌ Fondos de color en secciones (solo blanco)
3. ❌ Combinar #8CB1B9 sobre #D1D7D7 (opacidad visual)
4. ❌ Sombras pesadas o oscuras
5. ❌ Crear jerarquía cuando no existe (Ej: Estudiantes = Empresas)
6. ❌ Hardcodear colores en componentes
7. ❌ Cambiar colores archivo por archivo

---

## ✅ EJEMPLOS CORRECTOS

### Caso 1: Sin Jerarquía
```jsx
// Estudiantes y Empresas tienen MISMA importancia
<div className="flex gap-5">
  <Button variant="primary">Soy Estudiante</Button>
  <Button variant="primary-outline">Soy Empresa</Button>
</div>
```

### Caso 2: Con Jerarquía
```jsx
// Guardar es MÁS importante que Cancelar
<div className="flex gap-5">
  <Button variant="primary">Guardar</Button>
  <Button variant="secondary">Cancelar</Button>
</div>
```

### Caso 3: Card con Hover
```jsx
<div className="card hover-lift">
  <h3>Título</h3>
  <p className="text-secondary-500">Descripción</p>
  <Button variant="primary-outline">Ver Más</Button>
</div>
```

---

## 🎯 Resumen para Cambios Futuros

**Para cambiar TODO el diseño a otra paleta:**
1. Abre `tailwind.config.js`
2. Líneas 11-22: Cambia los valores HEX de `primary`
3. Línea 26: Cambia `neutral.border`
4. Guarda (Ctrl+S)
5. El navegador recarga automáticamente
6. **¡TODA la app cambia!** ✨

**Archivos a modificar:** 2  
**Pantallas a tocar:** 0  
**Sistema:** 100% Centralizado 🎉

---

*Creado: 2024-12-01*  
*Paleta: Turquesa Profesional (#8CB1B9)*  
*Sistema: Completamente Centralizado*
