
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("global-canvas-container");
    if (!container) return; 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 600;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    const initialColor = isLightMode ? 0x2563eb : 0x00d2ff;

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: initialColor,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.position.y += 0.002;
        particlesMesh.rotation.y += 0.0005;

        if (particlesMesh.position.y > 5) {
            particlesMesh.position.y = -5;
        }

        renderer.render(scene, camera);
    };
    animate();

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            setTimeout(() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'light') {
                    particlesMaterial.color.setHex(0x2563eb); 
                } else {
                    particlesMaterial.color.setHex(0x00d2ff); 
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