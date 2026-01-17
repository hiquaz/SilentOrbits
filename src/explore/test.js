function highlight(selected) {
  debrisList.forEach((o) => {
    o.orbit.material.opacity = 0.25;
    o.mesh.scale.setScalar(1);

    // Reset về độ rộng bình thường nếu đang được highlight
    if (o.orbit.userData.isHighlighted) {
      o.orbit.geometry.dispose();
      o.orbit.geometry = new THREE.RingGeometry(
        o.orbit.userData.originalInnerRadius,
        o.orbit.userData.originalOuterRadius,
        64
      );
      o.orbit.userData.isHighlighted = false;
    }
  });

  // Tạo geometry mới với độ rộng lớn hơn
  selected.orbit.geometry.dispose();
  selected.orbit.geometry = new THREE.RingGeometry(
    selected.radius - 0.02, // Độ rộng rất dày
    selected.radius + 0.02,
    64
  );

  selected.orbit.userData.isHighlighted = true;
  selected.orbit.material.opacity = 1.0;
  selected.mesh.scale.setScalar(5);

  updateInfoBoxImage(selected);

  const infoContent = document.createElement("div");
  infoContent.innerHTML = `
 <div style="text-align: center; margin-bottom: 15px;">
   <b style="color:#00ffff; font-size: 18px;">${selected.data.name}</b>
 </div>
 ━━━━━━━━━━━━━━━━━━━━━━━
 📡 <b>Nguồn gốc:</b> ${selected.data.origin}
 🚀 <b>Vận tốc:</b> ${selected.data.speed}
 🌀 <b>Quỹ đạo:</b> ${selected.data.orbit}
 ⚠️ <b>Ảnh hưởng:</b> ${selected.data.impact}
 🔬 <b>Nghiên cứu:</b> ${selected.data.research}
 🧠 <b>Hướng xử lý:</b> ${selected.data.action}
 `;

  infoBox.innerHTML = "";
  infoBox.appendChild(imageContainer);
  infoBox.appendChild(infoContent);
}
