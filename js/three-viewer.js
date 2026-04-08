/* ============================================================
   VERZA DESIGN — 3D Viewer
   Three.js Interactive 3D Model Viewer with Smooth Camera Controls
   Based on modelviewer.dev camera mechanics
   ============================================================ */

(function initThreeViewer() {
  const container = document.getElementById('three-viewer-container');
  if (!container) return;

  if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
    console.error('Three.js or GLTFLoader not loaded');
    return;
  }

  const MODEL_PATH = 'https://sxqxvdxtnouwfcdwsoai.supabase.co/storage/v1/object/public/Verza/Principal/3D/';
  const GLTFLoader = THREE.GLTFLoader;

  const ANIMATION_CONFIG = {
    duration: 1200,
    interpolationDecay: 42,
    easing: 'easeInOutCubic'
  };

  const PREDEFINED_VIEWS = {
    default: { orbit: { theta: 0.5, phi: 1.1, radius: 6 }, target: { x: 0, y: 0, z: 0 } },
    front: { orbit: { theta: 0, phi: 1.57, radius: 5 }, target: { x: 0, y: 0.5, z: 0 } },
    top: { orbit: { theta: 0, phi: 0.1, radius: 8 }, target: { x: 0, y: 0, z: 0 } },
    side: { orbit: { theta: 1.57, phi: 1.2, radius: 6 }, target: { x: 0, y: 0.5, z: 0 } },
    diagonal: { orbit: { theta: 0.8, phi: 0.9, radius: 7 }, target: { x: 0, y: 0, z: 0 } }
  };

  const models = [
    {
      id: 'demo_n1',
      name: 'Demo N1',
      file: 'Demo_n1.glb',
      hotspots: []
    }
  ];

  let currentModel = models[0];
  let scene, camera, renderer, controls, model;
  let isLoading = false;
  let animationId = null;
  let cameraAnimation = null;
  let isFullscreen = false;

  const loaderEl = document.getElementById('viewer-loader');
  const modelSelector = document.getElementById('model-selector');

  // Easing functions
  const easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutExpo: t => {
      if (t === 0 || t === 1) return t;
      if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
      return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    easeOutElastic: t => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };

  function init() {
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.5;
    controls.maxDistance = 15;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    // Add smooth stop behavior
    controls.enableSmoothing = true;
    controls.smoothingFactor = 0.08;

    setupLights();
    loadModel(currentModel.file);
    animate();

    window.addEventListener('resize', onWindowResize);
    setupViewControls();
    setupFullscreenControl();
  }

  function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xb4c6e7, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    scene.add(hemisphereLight);
  }

  function loadModel(filename) {
    if (isLoading) return;
    isLoading = true;
    
    showLoader(true);
    cancelCurrentAnimation();

    const loader = new THREE.GLTFLoader();
    
    loader.load(
      MODEL_PATH + filename,
      function(gltf) {
        if (model) {
          scene.remove(model);
          model.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(m => {
                    if (m.map) m.map.dispose();
                    m.dispose();
                  });
                } else {
                  if (child.material.map) child.material.map.dispose();
                  child.material.dispose();
                }
              }
            }
          });
        }

        model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.setScalar(scale);
        
        model.position.sub(center.multiplyScalar(scale));
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 0.5;
            }
          }
        });

        scene.add(model);
        
        animateCameraToView(PREDEFINED_VIEWS.default, 1500);
        
        isLoading = false;
        showLoader(false);
      },
      function(xhr) {
        if (xhr.lengthComputable) {
          const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
          if (loaderEl) {
            loaderEl.textContent = `Cargando modelo... ${progress}%`;
          }
        }
      },
      function(error) {
        console.error('Error loading model:', error);
        isLoading = false;
        showLoader(false);
        if (loaderEl) {
          loaderEl.textContent = 'Error al cargar el modelo';
        }
      }
    );
  }

  function animateCameraToView(viewConfig, duration = ANIMATION_CONFIG.duration, onComplete = null) {
    cancelCurrentAnimation();

    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();

    const spherical = new THREE.Spherical();
    spherical.setFromVector3(startPosition.clone().sub(controls.target));

    const endTheta = viewConfig.orbit.theta;
    const endPhi = viewConfig.orbit.phi;
    const endRadius = viewConfig.orbit.radius;
    const endTarget = new THREE.Vector3(viewConfig.target.x, viewConfig.target.y, viewConfig.target.z);

    const startTime = performance.now();
    const easeFn = easing[ANIMATION_CONFIG.easing] || easing.easeInOutCubic;

    function update() {
      const now = performance.now();
      const elapsed = now - startTime;
      let progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easeFn(progress);

      const newTheta = spherical.theta + (endTheta - spherical.theta) * easedProgress;
      const newPhi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + (endPhi - spherical.phi) * easedProgress));
      const newRadius = spherical.radius + (endRadius - spherical.radius) * easedProgress;

      const targetPos = endTarget.clone();
      camera.position.setFromSphericalCoords(newRadius, newPhi, newTheta).add(targetPos);
      controls.target.lerpVectors(startTarget, endTarget, easedProgress);
      controls.update();

      if (progress < 1) {
        cameraAnimation = requestAnimationFrame(update);
      } else {
        cameraAnimation = null;
        if (onComplete) onComplete();
      }
    }

    cameraAnimation = requestAnimationFrame(update);
  }

  function animateCameraToPosition(targetPos, duration = ANIMATION_CONFIG.duration) {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    
    const direction = targetPos.clone().sub(startTarget).normalize();
    const distance = startPosition.distanceTo(startTarget);
    const endRadius = Math.max(distance * 0.6, 1.5);
    
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(startPosition.clone().sub(startTarget));
    
    const thetaOffset = Math.atan2(direction.x, direction.z);
    const phiOffset = Math.acos(Math.max(-1, Math.min(1, direction.y)));

    const viewConfig = {
      orbit: {
        theta: spherical.theta + (thetaOffset - spherical.theta) * 0.5,
        phi: spherical.phi + (phiOffset - spherical.phi) * 0.5,
        radius: endRadius
      },
      target: {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z
      }
    };

    animateCameraToView(viewConfig, duration);
  }

  function cancelCurrentAnimation() {
    if (cameraAnimation) {
      cancelAnimationFrame(cameraAnimation);
      cameraAnimation = null;
    }
  }

  function resetView() {
    animateCameraToView(PREDEFINED_VIEWS.default, 800);
  }

  function setupViewControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'viewer-controls';
    controlsContainer.innerHTML = `
      <button class="view-control-btn" data-view="default" title="Vista predeterminada">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>
      <button class="view-control-btn" data-view="front" title="Vista frontal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
        </svg>
      </button>
      <button class="view-control-btn" data-view="top" title="Vista superior">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      </button>
      <button class="view-control-btn" data-view="side" title="Vista lateral">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
      <button class="view-control-btn" data-view="diagonal" title="Vista diagonal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z"/>
        </svg>
      </button>
    `;

    container.appendChild(controlsContainer);

    controlsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-control-btn');
      if (btn && PREDEFINED_VIEWS[btn.dataset.view]) {
        animateCameraToView(PREDEFINED_VIEWS[btn.dataset.view], 600);
      }
    });
  }

  function setupFullscreenControl() {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.setAttribute('title', 'Pantalla completa');
    fullscreenBtn.innerHTML = `
      <svg class="icon-expand" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
      </svg>
      <svg class="icon-compress" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
        <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7M14 20h6m0 0v-6m0 6l-7-7"/>
      </svg>
    `;

    container.appendChild(fullscreenBtn);

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function handleFullscreenChange() {
    const fullscreenBtn = container.querySelector('.fullscreen-btn');
    if (!fullscreenBtn) return;

    const isFull = document.fullscreenElement || document.webkitFullscreenElement;
    isFullscreen = isFull;

    const expandIcon = fullscreenBtn.querySelector('.icon-expand');
    const compressIcon = fullscreenBtn.querySelector('.icon-compress');

    if (isFull) {
      expandIcon.style.display = 'none';
      compressIcon.style.display = 'block';
      container.classList.add('is-fullscreen');
      setTimeout(onWindowResize, 100);
    } else {
      expandIcon.style.display = 'block';
      compressIcon.style.display = 'none';
      container.classList.remove('is-fullscreen');
      setTimeout(onWindowResize, 100);
    }
  }

  function showLoader(show) {
    if (loaderEl) {
      loaderEl.style.display = show ? 'flex' : 'none';
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (controls) {
      controls.update();
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function selectModel(modelId) {
    const modelData = models.find(m => m.id === modelId);
    if (modelData) {
      currentModel = modelData;
      loadModel(modelData.file);
      
      document.querySelectorAll('.model-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.model === modelId);
      });
    }
  }

  if (modelSelector) {
    modelSelector.addEventListener('click', (e) => {
      if (e.target.classList.contains('model-btn')) {
        selectModel(e.target.dataset.model);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();