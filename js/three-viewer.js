/* ============================================================
   VERZA DESIGN — 3D Viewer
   Three.js Interactive 3D Model Viewer with Hotspots
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
  
  const models = [
    {
      id: 'demo_n1',
      name: 'Demo N1',
      file: 'Demo_n1.glb',
      hotspots: []
    }
  ];

  let currentModel = models[0];
  let scene, camera, renderer, controls, model, hotspotElements = [];
  let isLoading = false;
  let animationId = null;

  const loaderEl = document.getElementById('viewer-loader');
  const modelSelector = document.getElementById('model-selector');

  function init() {
    const width = container.clientWidth;
    const height = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f4);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 20;
    controls.enablePan = true;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1;

    setupLights();
    loadModel(currentModel.file);
    animate();

    window.addEventListener('resize', onWindowResize);
  }

  function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(hemisphereLight);
  }

  function loadModel(filename) {
    if (isLoading) return;
    isLoading = true;
    
    showLoader(true);

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
                  child.material.forEach(m => m.dispose());
                } else {
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
          }
        });

        scene.add(model);
        
        fitCameraToModel();
        
        isLoading = false;
        showLoader(false);
        
        if (currentModel.hotspots && currentModel.hotspots.length > 0) {
          createHotspots(currentModel.hotspots);
        }
      },
      function(xhr) {
        const progress = (xhr.loaded / xhr.total * 100).toFixed(0);
        if (loaderEl) {
          loaderEl.textContent = `Cargando... ${progress}%`;
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

  function fitCameraToModel() {
    if (!model) return;
    
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;
    
    camera.position.set(center.x, center.y + size.y * 0.3, center.z + cameraZ);
    camera.lookAt(center);
    
    controls.target.copy(center);
    controls.update();
  }

  function createHotspots(hotspots) {
    clearHotspots();
    
    hotspots.forEach((hs, index) => {
      const btn = document.createElement('button');
      btn.className = 'viewer-hotspot';
      btn.setAttribute('data-position', hs.position);
      btn.setAttribute('data-normal', hs.normal || '0 1 0');
      
      const dot = document.createElement('div');
      dot.className = 'hotspot-dot';
      dot.style.setProperty('--dot-color', hs.color || '#DCFF00');
      
      const card = document.createElement('div');
      card.className = 'hotspot-card';
      card.innerHTML = `
        <strong class="hotspot-label">${hs.label}</strong>
        <p class="hotspot-content">${hs.content || ''}</p>
      `;
      
      btn.appendChild(dot);
      btn.appendChild(card);
      
      const pos = hs.position.split(' ').map(Number);
      const position = new THREE.Vector3(pos[0], pos[1], pos[2]);
      
      btn.addEventListener('click', () => {
        animateCameraToPosition(position);
      });
      
      btn.style.display = 'none';
      container.appendChild(btn);
      hotspotElements.push({ element: btn, position: position });
    });
  }

  function clearHotspots() {
    hotspotElements.forEach(hs => {
      if (hs.element && hs.element.parentNode) {
        hs.element.parentNode.removeChild(hs.element);
      }
    });
    hotspotElements = [];
  }

  function animateCameraToPosition(targetPos) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endTarget = targetPos.clone();
    const endPos = targetPos.clone().add(new THREE.Vector3(0, 0, 3));
    
    const duration = 1000;
    const startTime = Date.now();
    
    function updateCamera() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPos, endPos, eased);
      controls.target.lerpVectors(startTarget, endTarget, eased);
      controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(updateCamera);
      }
    }
    
    updateCamera();
  }

  function showLoader(show) {
    if (loaderEl) {
      loaderEl.style.display = show ? 'flex' : 'none';
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    
    const width = container.clientWidth;
    const height = 500;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (controls) {
      controls.update();
    }
    
    updateHotspotPositions();
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function updateHotspotPositions() {
    if (!model || hotspotElements.length === 0) return;
    
    hotspotElements.forEach(hs => {
      const pos = hs.position.clone();
      model.localToWorld(pos);
      
      pos.project(camera);
      
      const width = container.clientWidth;
      const height = 500;
      
      const x = (pos.x * 0.5 + 0.5) * width;
      const y = (-pos.y * 0.5 + 0.5) * height;
      
      const isVisible = pos.z < 1 && 
                        x > 0 && x < width && 
                        y > 0 && y < height;
      
      hs.element.style.display = isVisible ? 'block' : 'none';
      hs.element.style.left = x + 'px';
      hs.element.style.top = y + 'px';
      
      const dot = hs.element.querySelector('.hotspot-dot');
      if (dot) {
        dot.style.opacity = isVisible ? '1' : '0.3';
      }
    });
  }

  function selectModel(modelId) {
    const model = models.find(m => m.id === modelId);
    if (model) {
      currentModel = model;
      loadModel(model.file);
      
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