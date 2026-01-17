import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import debrisData from './debrisData.js'

// ==== CÀI ĐẶT CƠ BẢN ====
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// ==== LOADER CHO MÔ HÌNH ====
const gltfLoader = new GLTFLoader();

// ==== HÀM TẠO QUỸ ĐẠO & VẬT THỂ ====
function getOrbitingObject(debrisInfo, onLoadCallback) {
  const radius = 1 + Math.random() * 0.4;
  
  // Tạo quỹ đạo
  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(radius - 0.001, radius + 0.001, 64),
    new THREE.MeshBasicMaterial({
      color: debrisInfo.color,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true,
    })
  );

  // Quay quỹ đạo để nằm ngang
  orbit.rotation.x = Math.PI / 2;

  const orbitGroup = new THREE.Object3D();

  // Tạo trục quay ngẫu nhiên và góc quay
  const axis = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2, 
    (Math.random() - 0.5) * 2
  ).normalize();

  const angle = Math.random() * Math.PI;
  orbitGroup.setRotationFromAxisAngle(axis, angle);

  orbitGroup.add(orbit);
  scene.add(orbitGroup);

  let orbitAngle = Math.random() * Math.PI * 2;
  const speed = (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.002);

  // Load mô hình 3D thay vì điểm
  gltfLoader.load(`./models/${debrisInfo.model}`, (gltf) => {
    const modelMesh = gltf.scene;
    
    // Tối ưu hóa hiệu suất
    modelMesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
      }
    });

    // Scale rất nhỏ để phù hợp tỉ lệ Trái Đất
    const baseScale = debrisInfo.baseScale || 0.001;
    modelMesh.scale.setScalar(baseScale);
    
    // Xoay ngẫu nhiên ban đầu
    modelMesh.rotation.x = Math.random() * Math.PI;
    modelMesh.rotation.y = Math.random() * Math.PI;
    modelMesh.rotation.z = Math.random() * Math.PI;

    // Tạo vật liệu với màu sắc
    const material = new THREE.MeshBasicMaterial({ 
      color: debrisInfo.color,
      transparent: false
    });
    
    modelMesh.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });

    // Thêm vào orbitGroup
    orbitGroup.add(modelMesh);

    // Cập nhật vị trí model
    function updateModelPosition() {
      modelMesh.position.x = Math.cos(orbitAngle) * radius;
      modelMesh.position.z = Math.sin(orbitAngle) * radius;
      modelMesh.position.y = 0;
    }

    updateModelPosition();

    // Tự động xoay rất chậm để dễ nhìn hình dạng
    function updateModelRotation() {
      modelMesh.rotation.y += 0.001;
    }

    // Gọi callback khi load xong
    if (onLoadCallback) {
      onLoadCallback({
        mesh: modelMesh,
        orbit,
        orbitGroup, 
        radius,
        angle: orbitAngle,
        speed,
        collected: false,
        update: function() {
          orbitAngle += speed;
          updateModelPosition();
          updateModelRotation();
          updateScaleBasedOnZoom();
        },
        color: debrisInfo.color,
        data: debrisInfo,
        isHighlighted: false,
        baseScale: baseScale,
        material: material
      });
    }
  }, undefined, (error) => {
    console.error(`Lỗi loading model ${debrisInfo.model}:`, error);
    
    // Fallback: tạo hình cầu rất nhỏ
    const fallbackGeometry = new THREE.SphereGeometry(0.015, 8, 6);
    const fallbackMaterial = new THREE.MeshBasicMaterial({ 
      color: debrisInfo.color 
    });
    const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
    
    orbitGroup.add(fallbackMesh);

    function updateFallbackPosition() {
      fallbackMesh.position.x = Math.cos(orbitAngle) * radius;
      fallbackMesh.position.z = Math.sin(orbitAngle) * radius;
      fallbackMesh.position.y = 0;
    }

    updateFallbackPosition();

    if (onLoadCallback) {
      onLoadCallback({
        mesh: fallbackMesh,
        orbit,
        orbitGroup,
        radius,
        angle: orbitAngle,
        speed,
        collected: false,
        update: function() {
          orbitAngle += speed;
          updateFallbackPosition();
        },
        color: debrisInfo.color,
        data: debrisInfo,
        isHighlighted: false,
        baseScale: 0.001
      });
    }
  });

  // Hàm cập nhật scale dựa trên khoảng cách camera
  function updateScaleBasedOnZoom() {
    const earthDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    
    // Scale tăng khi zoom gần, nhưng vẫn giữ tỉ lệ nhỏ
    const scaleFactor = Math.max(0.3, 1.5 / earthDistance);
    const targetScale = (debrisInfo.baseScale || 0.001) * scaleFactor;
    
    // Tìm model mesh trong orbitGroup và cập nhật scale
    orbitGroup.children.forEach(child => {
      if (child !== orbit && child.isMesh) {
        child.scale.setScalar(targetScale);
      }
    });
  }

  // Trả về object tạm
  return {
    mesh: null,
    orbit,
    orbitGroup,
    radius,
    angle: orbitAngle,
    speed,
    update: function() {
      orbitAngle += speed;
      if (updateScaleBasedOnZoom) updateScaleBasedOnZoom();
    },
    color: debrisInfo.color,
    data: debrisInfo,
    isHighlighted: false
  };
}

// ==== PANEL DANH SÁCH ====
const panel = document.createElement("div");
Object.assign(panel.style, {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "rgba(0,0,0,0.6)",
  padding: "10px",
  borderRadius: "8px",
  color: "#fff",
  fontFamily: "monospace",
  maxHeight: "90vh",
  overflowY: "auto",
});
panel.innerHTML = "<b>🛰️ Space Debris List</b><br><br>";
document.body.appendChild(panel);

const collectBtn = document.createElement("button");
collectBtn.textContent = "🚀 COLLECT NEXT";
Object.assign(collectBtn.style, {
  marginTop: "10px",
  width: "100%",
  padding: "6px",
  cursor: "pointer",
  fontFamily: "monospace",
  background: "#00ffaa",
  border: "none",
  borderRadius: "6px"
});

panel.appendChild(collectBtn);

collectBtn.onclick = () => {
  if (collector.state !== "ORBIT") return;
  collector.requestNext = true;
};


// ==== Ô THÔNG TIN CHI TIẾT VỚI MÔ HÌNH 3D ====
const infoBox = document.createElement("div");
Object.assign(infoBox.style, {
  position: "absolute",
  top: "50%",
  left: "20px",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.85)",
  padding: "20px",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "monospace",
  width: "380px",
  lineHeight: "1.6em",
  whiteSpace: "pre-line",
  boxShadow: "0 0 25px rgba(0,0,0,0.4)",
});

// Tạo container cho mô hình 3D preview
const modelContainer = document.createElement("div");
modelContainer.id = "model-container";
Object.assign(modelContainer.style, {
  width: "100%",
  height: "150px",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "8px",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  position: "relative"
});

// Thêm text mặc định
const modelPlaceholder = document.createElement("div");


// Thêm phần thông tin mặc định
const defaultInfo = document.createElement("div");
infoBox.appendChild(defaultInfo);

document.body.appendChild(infoBox);

// ==== TẠO RENDERER CHO MÔ HÌNH TRONG INFOBOX ====
const modelScene = new THREE.Scene();
const modelCamera = new THREE.PerspectiveCamera(50, 380 / 150, 0.1, 10);
modelCamera.position.z = 2;

const modelRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
modelRenderer.setSize(380, 150);
modelRenderer.setClearColor(0x000000, 0);
modelRenderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// Ánh sáng cho scene mô hình
const modelLight = new THREE.DirectionalLight(0xffffff, 2);
modelLight.position.set(1, 1, 1);
modelScene.add(modelLight);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
modelScene.add(ambientLight);

// Biến để lưu model hiện tại
let currentModel = null;

// ==== HÀM CẬP NHẬT MÔ HÌNH TRONG INFOBOX ====
function updateInfoBoxModel(debrisObject) {
  // Xóa model cũ
  if (currentModel) {
    modelScene.remove(currentModel);
  }
  
  // Tải và hiển thị model mới
  gltfLoader.load(`./models/${debrisObject.data.model}`, (gltf) => {
    const model = gltf.scene.clone();
    
    // Scale và định vị model
    const scale = 0.8;
    model.scale.setScalar(scale);
    
    // Căn giữa model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    
    // Đặt màu sắc
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ 
          color: debrisObject.data.color
        });
      }
    });
    
    modelScene.add(model);
    currentModel = model;
    
  }, undefined, (error) => {
    console.error("Lỗi load model cho infobox:", error);
    // Fallback: hiển thị icon
    modelContainer.innerHTML = `<div style="color: ${'#' + debrisObject.data.color.toString(16).padStart(6, '0')}; font-size: 48px; text-align: center;">🛰️</div>`;
  });
}

// ==== TẠO DANH SÁCH RÁC VỚI MÔ HÌNH ====
const debrisList = [];

debrisData.forEach((d) => {
  const tempObj = getOrbitingObject(d, (loadedObj) => {
    const index = debrisList.findIndex(item => item.data.name === d.name);
    if (index !== -1) {
      debrisList[index] = loadedObj;
    }
    
    const btn = document.createElement("div");
    btn.textContent = d.name;
    btn.style.cursor = "pointer";
    btn.style.margin = "4px 0";
    btn.style.color = `#${d.color.toString(16).padStart(6, '0')}`;
    btn.onclick = () => highlight(loadedObj);

    loadedObj.uiButton = btn;

    panel.appendChild(btn);
  });
  
  debrisList.push(tempObj);
});

// === HIGHLIGHT KHI CLICK ===
function highlight(selected) {
  debrisList.forEach((o) => {
    o.isHighlighted = false;
    if (o.orbit) {
      o.orbit.material.opacity = 0.25;
      o.orbit.material.color.set(o.color);
    }
    if (o.mesh && o.material) {
      o.mesh.material.color.set(o.color);
      o.mesh.scale.setScalar(o.baseScale || 0.001);
    }
  });

  selected.isHighlighted = true;
   selected.orbit.geometry.dispose();
  
  
  if (selected.orbit) {
    selected.orbit.material.opacity = 1.0;
    selected.orbit.material.color.set(0xffffff);
     selected.orbit.geometry = new THREE.RingGeometry(
    selected.radius - 0.02, // Độ rộng rất dày
    selected.radius + 0.02,
    64
  );
  }
  
  if (selected.mesh && selected.material) {
    selected.mesh.material.color.set(0xffffff);
    selected.mesh.scale.multiplyScalar(4.5);
  }

  // Cập nhật infoBox với model
  updateInfoBoxModel(selected);

  // Thay thế model container bằng renderer
  modelContainer.innerHTML = "";
  modelContainer.appendChild(modelRenderer.domElement);

  // Cập nhật nội dung infoBox
  const infoContent = document.createElement("div");
  infoContent.innerHTML = `
<b style="color:#00ffff">${selected.data.name}</b>
━━━━━━━━━━━━━━━━━━━━━━━
📡 <b>Nguồn gốc:</b> ${selected.data.origin}
🚀 <b>Vận tốc:</b> ${selected.data.speed}
🌀 <b>Quỹ đạo:</b> ${selected.data.orbit}
⚠️ <b>Ảnh hưởng:</b> ${selected.data.impact}
🔬 <b>Nghiên cứu:</b> ${selected.data.research}
🧠 <b>Hướng xử lý:</b> ${selected.data.action}
🧠 <b>Trọng lượng:</b> ${selected.data.mass}
`;

  // Cập nhật infoBox
  infoBox.innerHTML = "";
  infoBox.appendChild(modelContainer);
  infoBox.appendChild(infoContent);
}



// ==== TRÁI ĐẤT ====
const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 4.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const moonGroup = new THREE.Group();
scene.add(moonGroup);
const moonMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/06_moonmap4k.jpg"),
  bumpMap: loader.load("./textures/07_moonbump4k.jpg"),
  bumpScale: 2,
});
const moonMesh = new THREE.Mesh(geometry, moonMat);
moonMesh.position.set(2, 0, 0);
moonMesh.scale.setScalar(0.27);
moonGroup.add(moonMesh);

// ==== RAYCASTER CLICK ====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("click", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(debrisList.map(p => p.mesh).filter(mesh => mesh !== null));
  if (intersects.length > 0) {
    const target = debrisList.find(p => p.mesh === intersects[0].object);
    if (target) highlight(target);
  }
});

// ================= COLLECTOR SHIP (SIMPLE & SAFE) =================
const collector = {
  mesh: null,
  angle: 0,
  radius: 1.35,
  speed: 0.002,
  state: "ORBIT",
  target: null,
  manualMode: true,
  requestNext: false
};

// Tạo tàu bằng geometry cơ bản
function createCollectorShip() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  body.rotation.z = Math.PI / 2;
  group.add(body);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.015, 0.04, 8),
    new THREE.MeshStandardMaterial({ color: 0xff3333 })
  );
  nose.position.x = 0.05;
  nose.rotation.z = Math.PI / 2;
  group.add(nose);

  return group;
}

collector.mesh = createCollectorShip();
scene.add(collector.mesh);
function updateCollectorOrbitSafe() {
  if (!collector.mesh) return;

  collector.angle += collector.speed;

  const x = Math.cos(collector.angle) * collector.radius;
  const z = Math.sin(collector.angle) * collector.radius;

  collector.mesh.position.set(x, 0, z);

  // Hướng tàu theo quỹ đạo
  collector.mesh.lookAt(0, 0, 0);
}
function findNearestLightDebris() {
  let nearest = null;
  let minDist = Infinity;

  debrisList.forEach(d => {
    if (!d.mesh) return;
    if (d.collected) return;
    if (d.data.mass >= 10) return; // mass lớn hơn 10 là nặng

    //minDist = dist;
    nearest = d;

    // const dist = collector.mesh.position.distanceTo(d.mesh.position);
    // if (dist < minDist) {
    //   minDist = dist;
    //   nearest = d;
    // }
  });

  return nearest;
}
function updateCollectorAI_Safe() {
  if (!collector.mesh) return;

  // ORBIT → tìm rác
  // if (collector.state === "ORBIT") {
  //   const target = findNearestLightDebris();
  //   if (target) {
  //     collector.target = target;
  //     collector.state = "CHASE";
  //   }
  // }
  if (collector.state === "ORBIT" && collector.requestNext) {
    const target = findNearestLightDebris();
    if (target) {
      collector.target = target;
      collector.state = "CHASE";
      collector.requestNext = false;
    }
  }
  

  // CHASE → bay tới rác
  if (collector.state === "CHASE" && collector.target?.mesh) {
    const targetPos = collector.target.mesh.position;

    collector.mesh.position.lerp(targetPos, 0.03);
    collector.mesh.lookAt(targetPos);

    const dist = collector.mesh.position.distanceTo(targetPos);
    if (dist < 0.05) {
      collector.state = "COLLECT";
    }
  }

  // COLLECT → hút rác
  if (collector.state === "COLLECT" && collector.target?.mesh) {
    const debris = collector.target;

    // debris.mesh.position.lerp(collector.mesh.position, 0.03);
    // debris.mesh.scale.multiplyScalar(0.9);

    // if (debris.mesh.scale.x < 0.002) {
    //   debris.mesh.visible = false;
    //   debris.collected = true;

    //   // ĐÁNH DẤU CHUẨN BỊ ĐỐT
    //   debris.data.action = "Atmospheric Burn";

    //   collector.target = null;
    //   collector.state = "ORBIT";
    // }
    debris.mesh.position.lerp(collector.mesh.position, 0.03);
    const dist = debris.mesh.position.distanceTo(collector.mesh.position);

    // chỉ co nhỏ khi đã gần tàu
    if (dist < 0.08) {
      debris.mesh.scale.multiplyScalar(0.85);
    }

    // chạm tàu
    if (dist < 0.02) {

      const burn = createBurnEffect(debris.mesh.position);
      burnEffects.push(burn);

      debris.mesh.visible = false;
      debris.collected = true;
      debris.data.action = "Atmospheric Burn";

      collector.target = null;
      collector.state = "ORBIT";

      if (debris.uiButton) {
        debris.uiButton.remove();
      }      
    }
  }
}
const burnEffects = [];
function createBurnEffect(position) {
  const material = new THREE.SpriteMaterial({
    color: 0xffaa33,
    transparent: true,
    opacity: 1
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.1, 0.1, 0.1);
  sprite.position.copy(position);

  sprite.userData.life = 1.0;
  scene.add(sprite);

  return sprite;
}
function updateBurnEffects() {
  for (let i = burnEffects.length - 1; i >= 0; i--) {
    const fx = burnEffects[i];
    fx.userData.life -= 0.04;

    fx.scale.multiplyScalar(1.08);
    fx.material.opacity = fx.userData.life;

    if (fx.userData.life <= 0) {
      scene.remove(fx);
      burnEffects.splice(i, 1);
    }
  }
}



// ==== ANIMATION LOOP ====
function animate() {
  requestAnimationFrame(animate);

  // Cập nhật debris
  debrisList.forEach((d) => {
    if (d.update){
      // if (collector.state === "COLLECT" && d == collector.target){
      if (d == collector.target){

      }else{
        d.update();
      }
    } 
  });

  // Cập nhật model preview xoay
  if (currentModel) {
    currentModel.rotation.y += 0.01;
    modelRenderer.render(modelScene, modelCamera);
  }
  //updateCollectorOrbitSafe();
  updateCollectorAI_Safe();
  updateBurnEffects();
  // Cập nhật các chuyển động khác
  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  moonGroup.rotation.y += 0.01;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ==== RESIZE ====
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);
