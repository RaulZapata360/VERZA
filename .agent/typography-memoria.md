# Memoria de Tipografías - VERZA Design

## Actualización: Abril 2026

### Tipografía Principal (Script/Manuscrita)
- **Fuente actual:** Style Script (Google Fonts)
- **Variable CSS:** `--font-script`
- **Aplicada a:** 
  - Hero: "esencia"
  - Nosotras: "Verza Design" (Detrás de Verza Design) - `font-family:var(--font-script);font-size:1.1em`
  - Portafolio: "VERZA" (Proyectos VERZA) - `font-family:var(--font-script);font-size:1.1em`
  
### Cómo cambiar la tipografía en el futuro

1. **Cambiar la fuente en index.html** (línea ~15):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=NOMBRE_FUENTE&display=swap" rel="stylesheet" />
   ```

2. **Actualizar la variable CSS en style.css** (línea ~36):
   ```css
   --font-script: 'NOMBRE_FUENTE', cursive;
   ```

3. **Elementos que usan esta tipografía:**
   - `.handwritten` (clase general para textos script)
   - Elementos con `style="font-family:var(--font-script)"`

---

## Textos con Tipografía Script (handwritten class)

### index.html

| Sección | Texto | Línea |
|---------|-------|-------|
| Hero | "esencia." | 138 |
| Nosotras | "diferente." | 242 |
| Nosotras | "creatividad," | 243 |
| Nosotras | "intención." | 251 |
| Proceso | "Proceso" | 423 |
| Visor 3D | "3D" | 715 |
| Footer | "amor" | 956 |

### galeria.html

| Sección | Texto | Línea |
|---------|-------|-------|
| Hero | "Proyectos" | 88 |
| Contacto | "magia" | 538 |
| Footer | "amor" | 625 |

---

## Notas Importantes

- La tipografía "brand-script" (Nothing You Could Do) ya no se usa activamente
- La clase `.handwritten` ahora apunta a `--font-script` que es Style Script
- Para textos especiales como "Verza Design" en Nosotras, se usa directamente `style="font-family:var(--font-script)"` en lugar de la clase

---

## Historial de Cambios

| Fecha | Cambio |
|-------|--------|
| Abril 2026 | Cambio de Dancing Script a Style Script como tipografía principal |