# Memoria de Tipografías - VERZA Design

## Actualización: Abril 2026

### Tipografía para Palabras Destacadas (brand-script)
- **Fuente:** Nothing You Could Do (Google Fonts)
- **Clase CSS:** `.brand-script`
- **Aplicada a:** Todas las palabras destacadas del sitio

### Cómo cambiar la tipografía en el futuro

1. **Cambiar la fuente en index.html** (línea ~15):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=NOMBRE_FUENTE&display=swap" rel="stylesheet" />
   ```

2. **Actualizar la variable CSS en style.css** (línea ~37):
   ```css
   --font-brand-script: 'NOMBRE_FUENTE', cursive;
   ```

3. **Elementos que usan esta tipografía:**
   - `.brand-script` (clase para palabras destacadas)
   - Elementos con `style="font-family:var(--font-brand-script)"`

---

## Textos con Tipografía Destacada (brand-script)

### index.html

| Sección | Texto | Línea | Color |
|---------|-------|-------|-------|
| Hero | "esencia" | 138 | heredado |
| Nosotras | "diferente" | 242 | heredado |
| Nosotras | "creatividad" | 243 | heredado |
| Nosotras | "intención" | 251 | heredado |
| Proceso | "Proceso" | 423 | heredado (sin azul) |
| Visor 3D | "3D" | 718 | azul (royal-blue) |
| Contacto | "espacio" | 770 | heredado |
| Footer | "amor" | 959 | azul (royal-blue) |

### galeria.html

| Sección | Texto | Línea | Color |
|---------|-------|-------|-------|
| Hero | "Proyectos" | 88 | verde (#DCFF00) |
| Contacto | "magia" | 538 | verde (#DCFF00) |
| Footer | "amor" | 625 | azul (royal-blue) |

---

## Notas Importantes

- La clase `.handwritten` ya no se usa para palabras destacadas
- Todas las palabras destacadas ahora usan `.brand-script` (Nothing You Could Do)
- El tamaño recomendado es `font-size:1.1em` para mantener consistencia
- Colores se mantienen inline donde estaban definidos

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| Abril 2026 | Cambio de Style Script a Nothing You Could Do para todas las palabras destacadas |
| Abril 2026 | Proceso "Proceso" sin color azul |
| Abril 2026 | Visor 3D "3D" en color azul |