# Skill: Cámara Mejorada GLB

## Descripción
Implementa la funcionalidad de **click en hotspot → mover cámara** para el componente `<model-viewer>`. Permite que al hacer clic en un marcador, la cámara rote y se enfoque en ese punto específico del modelo 3D.

Basado en: https://modelviewer.dev/examples/annotations/index.html

## Uso
Utiliza esta skill cuando necesites:
- Añadir interacción click a hotspots en modelos GLB
- Mover la cámara automáticamente al hacer clic en un marcador
- Guardar coordenadas de cámara predefinidas para cada hotspot

---

## Técnicas Principales

### 1. Cámara con coordenadas predefinidas (Recomendado)

El método más preciso: guardar `data-orbit` y `data-target` para cada hotspot.

```html
<model-viewer id="mi-visor" src="modelo.glb" camera-controls>
  <button class="hotspot" slot="hotspot-1" 
    data-position="0 1.75 0.35" 
    data-normal="0 0 1"
    data-orbit="-50deg 84deg 0.5m"
    data-target="0 1.5 0">
    Mi Punto
  </button>
</model-viewer>

<script type="module">
  const viewer = document.querySelector('#mi-visor');
  
  // Añadir evento click a cada hotspot
  viewer.querySelectorAll('button[slot^="hotspot-"]').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      const dataset = e.target.dataset;
      // Mover cámara a la posición guardada
      viewer.cameraTarget = dataset.target;
      viewer.cameraOrbit = dataset.orbit;
    });
  });
</script>
```

### 2. Cámara calculada dinámicamente desde la normal

Si no tienes las coordenadas predefinidas, puedes calcularlas usando el vector normal del hotspot.

```javascript
// Función para calcular camera-orbit desde una normal
function calcularCameraOrbitDesdeNormal(normal) {
  // normal: objeto {x, y, z} del hotspot
  const theta = Math.atan2(normal.x, normal.z);  // ángulo horizontal
  const phi = Math.acos(normal.y);              // ángulo vertical
  return `${theta}rad ${phi}rad 1m`;
}

// Usar con positionAndNormalFromPoint para clicks en el modelo
viewer.addEventListener('click', (e) => {
  const result = viewer.positionAndNormalFromPoint(e.clientX, e.clientY);
  if (result) {
    // Mover cámara al puntoclickeado
    viewer.cameraTarget = result.position.toString();
    const orbit = calcularCameraOrbitDesdeNormal(result.normal);
    viewer.cameraOrbit = orbit;
  }
});
```

### 3. Cámara con animación suave

```javascript
function moverCamaraConAnimacion(viewer, target, orbit) {
  viewer.cameraTarget = target;
  viewer.cameraOrbit = orbit;
  // Opcional: ajustar duración de interpolación
  viewer.interpolationDecay = 200; // ms
}
```

---

## Estructura de Datos para Hotspots

### Atributos requeridos
- `data-position`: Posición 3D del hotspot (formato: "x y z")
- `data-normal`: Vector normal que define la "frontal" del hotspot

### Atributos opcionales para cámara
- `data-orbit`: Órbita de la cámara (formato: "theta phi distancia")
- `data-target`: Punto objetivo de la cámara

### Ejemplo completo
```html
<button class="mi-hotspot" 
  slot="hotspot-1"
  data-position="0 1.75 0.35"
  data-normal="0 0 1"
  data-orbit="-30deg 75deg 0.5m"
  data-target="0 1.5 0">
  <span class="hotspot-label">Entrada Principal</span>
</button>
```

---

## Atributos del modelo-viewer relacionados

| Atributo | Descripción |
|----------|-------------|
| `camera-target` | Punto focal de la cámara (default: "0m 0m 0m") |
| `camera-orbit` | Posición orbital (formato: "theta phi distancia") |
| `camera-controls` | Habilita controles de cámara |
| `interpolation-decay` | Duración de animaciones (ms) |
| `min-camera-orbit` | Límite mínimo de órbita |
| `max-camera-orbit` | Límite máximo de órbita |

---

## Casos de Uso

### Caso 1: Tour interactivo del modelo
Hotspots con etiquetas que al hacer clic muestran más información Y mueven la cámara.

### Caso 2: Marcadores informativos
Al hacer clic, la cámara rota para ver el detalle desde el mejor ángulo.

### Caso 3: Control de obra / Topografía
Puntos de control con coordenadas predefinidas para mostrar vistas específicas de la construcción.

---

## Errores Comunes

1. **La cámara no se mueve**: Verificar que el hotspot tenga `data-orbit` y `data-target`
2. **Coordenadas incorrectas**: Usar el editor de model-viewer para obtener valores precisos
3. **Hotspot no clickeable**: Asegurar que `pointer-events` no esté deshabilitado en el CSS

---

## Recursos

- Documentación oficial: https://modelviewer.dev/docs/
- Editor interactivo: https://modelviewer.dev/editor/
- Issue relacionado: https://github.com/google/model-viewer/discussions/4788

---

## Staging & Camera Control

Utiliza estas características para encuadrar la toma perfecta para tu modelo.

### Habilitar controles de cámara

Usa el atributo `camera-controls` para habilitar la interacción del usuario.

```html
<model-viewer camera-controls touch-action="pan-y" src="model.glb" alt="A 3D model"></model-viewer>
```

### Posición inicial de cámara

Establece `camera-orbit` para cambiar el ángulo y posición inicial de la cámara.

```html
<model-viewer camera-controls touch-action="pan-y" camera-orbit="45deg 55deg 4m" src="model.glb" alt="A 3D model"></model-viewer>
```

### Cámara synced con scroll

Usa CSS-like `calc()` para sincronizar la órbita de la cámara con la posición del scroll.

```html
<model-viewer 
  camera-controls 
  touch-action="pan-y" 
  camera-orbit="calc(-1.5rad + env(window-scroll-y) * 4rad) calc(0deg + env(window-scroll-y) * 180deg) calc(5m - env(window-scroll-y) * 10m)"
  src="model.glb" 
  alt="A 3D model">
</model-viewer>
```

### Deshabilitar zoom

Deshabilita el zoom para que las interacciones de wheel y pinch tengan el comportamiento predeterminado del navegador.

```html
<model-viewer camera-controls touch-action="pan-y" disable-zoom src="model.glb" alt="A 3D model"></model-viewer>
```

### Animación automática de órbitas

La cámara automáticamente interpola entre órbitas (incluso cuando los controles están deshabilitados).

```html
<model-viewer id="orbit-demo" interpolation-decay="200" src="model.glb" alt="A 3D model"></model-viewer>

<script>
  const modelViewer = document.querySelector('#orbit-demo');
  const orbitCycle = [
    '45deg 55deg 4m',
    '-60deg 110deg 2m',
    modelViewer.cameraOrbit
  ];

  setInterval(() => {
    const currentOrbitIndex = orbitCycle.indexOf(modelViewer.cameraOrbit);
    modelViewer.cameraOrbit = orbitCycle[(currentOrbitIndex + 1) % orbitCycle.length];
  }, 3000);
</script>
```

### Objetivo de cámara (camera-target)

Por defecto, la cámara apunta al centro del bounding box del modelo. Usa `camera-target` para orbitar una coordenada diferente.

```html
<!-- Centro predeterminado -->
<model-viewer camera-controls camera-target="0m 0m 0m" auto-rotate src="model.glb" alt="3D model"></model-viewer>
```

### Deshabilitar Tap/Pan

`disable-pan` deshabilita todo el movimiento de paneo. `disable-tap` deshabilita solo los comportamientos de click/tap.

```html
<model-viewer id="pan-demo" disable-tap auto-rotate camera-controls touch-action="pan-y" src="model.glb" alt="Neil Armstrong's Spacesuit"></model-viewer>
```

Nota: Después de hacer pan y rotar el modelo, puede ser muy difícil volver al centrado original. Se recomienda implementar tu propia lógica de recentrado usando `camera-target`.

### Rotar el skybox

Los event listeners pueden cooperar con `camera-controls`. Usando shift-drag o two-finger drag en móvil, se puede rotar el skybox para ver cómo el entorno reflejaría luz desde diferentes ángulos.

```html
<model-viewer id="envlight-demo" camera-controls touch-action="pan-y" disable-pan oncontextmenu="return false;" src="model.glb" skybox-image="environment.hdr" alt="3D model"></model-viewer>

<script type="module">
  const modelViewer = document.querySelector("#envlight-demo");
  
  let lastX;
  let panning = false;
  let skyboxAngle = 0;
  let radiansPerPixel;
      
  const startPan = () => {
    const orbit = modelViewer.getCameraOrbit();
    const { radius } = orbit;
    radiansPerPixel = -1 * radius / modelViewer.getBoundingClientRect().height;
    modelViewer.interactionPrompt = 'none';
  };
  
  const updatePan = (thisX) => {      
    const delta = (thisX - lastX) * radiansPerPixel;
    lastX = thisX;
    skyboxAngle += delta;
    const orbit = modelViewer.getCameraOrbit();
    orbit.theta += delta;
    modelViewer.cameraOrbit = orbit.toString();
    modelViewer.resetTurntableRotation(skyboxAngle);
    modelViewer.jumpCameraToGoal();
  }
  
  modelViewer.addEventListener('mousedown', (event) => {
    panning = event.button === 2 || event.ctrlKey || event.metaKey || event.shiftKey;
    if (!panning) return;
    lastX = event.clientX;
    startPan();
    event.stopPropagation();
  }, true);

  modelViewer.addEventListener('touchstart', (event) => {
    const {targetTouches, touches} = event;
    panning = targetTouches.length === 2 && targetTouches.length === touches.length;
    if (!panning) return;
    lastX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
    startPan();
  }, true);

  self.addEventListener('mousemove', (event) => {
    if (!panning) return;
    updatePan(event.clientX);
    event.stopPropagation();
  }, true);

  modelViewer.addEventListener('touchmove', (event) => {
    if (!panning || event.targetTouches.length !== 2) return;
    const {targetTouches} = event;
    const thisX = 0.5 * (targetTouches[0].clientX + targetTouches[1].clientX);
    updatePan(thisX);
  }, true);

  self.addEventListener('mouseup', () => { panning = false; }, true);
  modelViewer.addEventListener('touchend', () => { panning = false; }, true);
</script>
```

### Personalizar interaction prompts

Crea tus propios prompts de interacción con uno o dos puntos de touch.

```html
<style>
  .dot {
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 50%;
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.7), 0px 0px 5px 1px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.9);
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>

<model-viewer id="prompt-demo" camera-controls touch-action="pan-y" interaction-prompt="none" src="model.glb" alt="3D model">
  <div class="dot" slot="finger0"></div>
  <div class="dot" slot="finger1"></div>
</model-viewer>

<script>
  const modelViewerPrompt = document.querySelector("#prompt-demo");
  
  const PROMT_MS = 3000;
  const REPEAT_MS = 5000;

  const finger0 = {
    x: { initialValue: 0.6, keyframes: [{frames: 1, value: 0.7}, {frames: 1, value: 0.5}, {frames: 1, value: 0.7}, {frames: 1, value: 0.6}] },
    y: { initialValue: 0.45, keyframes: [{frames: 1, value: 0.4}, {frames: 1, value: 0.3}, {frames: 1, value: 0.4}, {frames: 1, value: 0.45}] }
  };

  const finger1 = {
    x: { initialValue: 0.4, keyframes: [{frames: 1, value: 0.3}, {frames: 1, value: 0.1}, {frames: 1, value: 0.3}, {frames: 1, value: 0.4}] },
    y: { initialValue: 0.55, keyframes: [{frames: 1, value: 0.6}, {frames: 1, value: 0.5}, {frames: 1, value: 0.6}, {frames: 1, value: 0.55}] }
  };

  let hasInteracted = false;

  const prompt = () => {
    if (!hasInteracted) {
      modelViewerPrompt.interact(PROMT_MS, finger0, finger1);
      setTimeout(prompt, REPEAT_MS);
    }
  };

  modelViewerPrompt.addEventListener('poster-dismissed', () => { prompt(); }, {once: true});

  const interacted = (event) => {
    if (event.detail.source === 'user-interaction') {
      hasInteracted = true;
      modelViewerPrompt.removeEventListener('camera-change', interacted);
    }
  };

  modelViewerPrompt.addEventListener('camera-change', interacted);
</script>
```

---

## Atributos de Cámara Completos

| Atributo | Descripción | Ejemplo |
|----------|-------------|---------|
| `camera-controls` | Habilita interacción de cámara | `camera-controls` |
| `camera-orbit` | Posición inicial (theta phi radius) | `45deg 55deg 4m` |
| `camera-target` | Punto focal de la cámara | `0m 1.5m 0m` |
| `disable-zoom` | Deshabilita zoom | `disable-zoom` |
| `disable-pan` | Deshabilita paneo | `disable-pan` |
| `disable-tap` | Deshabilita tap/click | `disable-tap` |
| `touch-action` | Controla comportamiento touch | `pan-y` |
| `interpolation-decay` | Duración de interpolación (ms) | `200` |
| `min-camera-orbit` | Límite mínimo de órbita | `0deg 0deg 2m` |
| `max-camera-orbit` | Límite máximo de órbita | `180deg 90deg 10m` |
| `auto-rotate` | Rotación automática | `auto-rotate` |
| `auto-rotate-delay` | Retraso antes de auto-rotar | `3000` |
| `interaction-prompt` | Prompt de interacción | `none`, `when-focused`, `always` |
| `shadow-intensity` | Intensidad de sombras | `1` |
| `skybox-image` | Imagen de entorno HDR | `environment.hdr` |