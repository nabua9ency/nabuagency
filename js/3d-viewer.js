
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    
    
    const initialGlobeColor = isLightMode ? 0x2563eb : 0x00d2ff;
    const initialGlobeOpacity = isLightMode ? 0.3 : 0.15;
    const initialStarsColor = isLightMode ? 0x2563eb : 0xffffff;
    const initialStarsOpacity = isLightMode ? 0.4 : 0.3;

    
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: initialGlobeColor,
        wireframe: true,
        transparent: true,
        opacity: initialGlobeOpacity
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: initialStarsColor,
        transparent: true,
        opacity: initialStarsOpacity
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    
    const animate = () => {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.0015;
        globe.rotation.x += 0.0005;
        particlesMesh.rotation.y -= 0.0002;
        renderer.render(scene, camera);
    };
    animate();

    
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            setTimeout(() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'light') {
                    material.color.setHex(0x2563eb); 
                    material.opacity = 0.3;
                    particlesMaterial.color.setHex(0x2563eb);
                    particlesMaterial.opacity = 0.4;
                } else {
                    material.color.setHex(0x00d2ff); 
                    material.opacity = 0.15;
                    particlesMaterial.color.setHex(0xffffff); 
                    particlesMaterial.opacity = 0.3;
                }
            }, 50); 
        });
    }

    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});