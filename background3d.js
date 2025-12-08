import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Background3D {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.dragonflies = [];

        console.log('🚀 Inicializando Background 3D...');
        this.initThree();
        this.loadModel();
        this.addEventListeners();
        this.animate();
    }

    initThree() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera - FOV más amplio para ver más objetos
        this.camera = new THREE.PerspectiveCamera(
            60, // FOV aumentado de 50 a 60
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;

        // Renderer con fondo transparente
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,  // Fondo transparente
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights - Sistema de iluminación mejorado
        // Luz ambiental suave
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Luz principal (key light)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(10, 10, 10);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        // Luz de relleno (fill light)
        const fillLight = new THREE.DirectionalLight(0xA4B5F2, 0.8);
        fillLight.position.set(-10, 5, -5);
        this.scene.add(fillLight);

        // Luz trasera (rim light) para resaltar bordes
        const rimLight = new THREE.DirectionalLight(0x5753a3, 1.2);
        rimLight.position.set(0, -5, -10);
        this.scene.add(rimLight);

        // Luz puntual para efecto dramático
        const pointLight = new THREE.PointLight(0xA4B5F2, 2, 50);
        pointLight.position.set(0, 8, 5);
        this.scene.add(pointLight);

        console.log('✅ Three.js inicializado');
    }

    loadModel() {
        const loader = new GLTFLoader();

        console.log('📦 Intentando cargar: 3D/libelula.glb');

        loader.load(
            '3D/libelula.glb',
            (gltf) => {
                console.log('✅ Modelo GLB cargado exitosamente!', gltf);
                const model = gltf.scene;

                // Get model size
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                console.log('📏 Tamaño del modelo:', size);

                // Create multiple dragonflies - distribución elíptica horizontal
                const count = 9; // 3 objetos más
                for (let i = 0; i < count; i++) {
                    const dragonfly = model.clone();

                    // Distribución elíptica horizontal (más ancha que alta) - Expandida 1.5x
                    const angle = (i / count) * Math.PI * 2;
                    const radiusX = (7 + Math.random() * 3) * 1.5; // Radio horizontal expandido (10.5-15)
                    const radiusY = (3 + Math.random() * 1.5) * 1.5; // Radio vertical expandido (4.5-6.75)

                    dragonfly.position.x = Math.cos(angle) * radiusX;
                    dragonfly.position.y = Math.sin(angle) * radiusY;
                    dragonfly.position.z = (Math.random() - 0.5) * 6; // Más profundidad (expandida 1.5x)

                    // Escalas variadas
                    const scale = Math.random() * 2 + 1.2;
                    dragonfly.scale.set(scale, scale, scale);

                    // Rotación inicial aleatoria
                    dragonfly.rotation.x = Math.random() * Math.PI * 2;
                    dragonfly.rotation.y = Math.random() * Math.PI * 2;
                    dragonfly.rotation.z = Math.random() * Math.PI * 2;

                    // Apply material
                    this.applyMaterial(dragonfly);

                    this.scene.add(dragonfly);
                    console.log(`🦋 Libélula ${i + 1} agregada:`, {
                        position: dragonfly.position,
                        scale: scale
                    });

                    // Store with animation data - velocidades reducidas al 10%
                    this.dragonflies.push({
                        mesh: dragonfly,
                        baseX: dragonfly.position.x,
                        baseY: dragonfly.position.y,
                        baseZ: dragonfly.position.z,
                        speedX: (Math.random() - 0.5) * 0.0015,  // 10% de 0.015
                        speedY: (Math.random() - 0.5) * 0.0015,  // 10% de 0.015
                        speedZ: (Math.random() - 0.5) * 0.0008,  // 10% de 0.008
                        rotationSpeed: (Math.random() - 0.5) * 0.002, // 10% de 0.02
                        hoverOffset: Math.random() * Math.PI * 2
                    });
                }

                console.log(`✅ ${this.dragonflies.length} libélulas en la escena`);
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(2);
                console.log(`⏳ Cargando modelo GLB... ${percent}%`);
            },
            (error) => {
                console.error('❌ Error cargando modelo GLB:', error);
                console.log('💡 Usando fondo de reserva (degradado simple)');

                // Ocultar el canvas 3D y mostrar solo el fondo degradado
                this.canvas.style.display = 'none';
            }
        );
    }

    applyMaterial(model) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (isDark) {
                    // Dark mode - material brillante como un foco encendido
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xEDF1FD,
                        emissive: 0xEDF1FD,  // Mismo color que el principal para brillo intenso
                        emissiveIntensity: 2.5,  // Intensidad muy alta para efecto de foco
                        metalness: 0.9,  // Muy metálico para reflejar más luz
                        roughness: 0.05,  // Muy suave para máximo brillo
                        transparent: true,
                        opacity: 1
                    });
                } else {
                    // Light mode - material suave con buen contraste
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xA1B1F4,
                        metalness: 0.1,
                        roughness: 0.5,
                        transparent: true,
                        opacity: 1
                    });
                }
            }
        });
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Hide canvas when scrolling past hero section
        window.addEventListener('scroll', () => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

                if (window.scrollY > heroBottom - 200) {
                    this.canvas.classList.add('hidden');
                } else {
                    this.canvas.classList.remove('hidden');
                }
            }
        });

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            console.log('🎨 Tema cambiado, actualizando materiales...');

            // Actualizar materiales
            this.dragonflies.forEach(df => {
                this.applyMaterial(df.mesh);
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        const time = Date.now() * 0.001;

        this.dragonflies.forEach((df, index) => {
            // Mouse influence - reducido al 10%
            df.mesh.position.x = df.baseX + this.mouse.x * 0.25; // 10% de 2.5
            df.mesh.position.y = df.baseY + this.mouse.y * 0.25; // 10% de 2.5

            // Floating animation
            df.baseX += df.speedX;
            df.baseY += df.speedY;
            df.baseZ += df.speedZ;

            // Hovering effect
            df.mesh.position.y += Math.sin(time * 2 + df.hoverOffset) * 0.015;

            // Rotation
            df.mesh.rotation.y += df.rotationSpeed;
            df.mesh.rotation.x = Math.sin(time + index) * 0.1;

            // Collision detection with other dragonflies
            this.dragonflies.forEach((other, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = df.baseX - other.baseX;
                    const dy = df.baseY - other.baseY;
                    const dz = df.baseZ - other.baseZ;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    const minDistance = 3; // Distancia mínima entre libélulas

                    if (distance < minDistance) {
                        // Separar las libélulas
                        const angle = Math.atan2(dy, dx);
                        df.speedX = Math.cos(angle) * Math.abs(df.speedX);
                        df.speedY = Math.sin(angle) * Math.abs(df.speedY);
                        df.speedZ *= -1;
                    }
                }
            });

            // Boundaries - expandidos 1.5x para distribución más amplia
            if (Math.abs(df.baseX) > 10) df.speedX *= -1; // Límite horizontal expandido (15 * 1.5)
            if (Math.abs(df.baseY) > 10) df.speedY *= -1;    // Límite vertical expandido (6 * 1.5)
            if (Math.abs(df.baseZ) > 10) df.speedZ *= -1;  // Límite profundidad expandido (5 * 1.5)
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM cargado, iniciando Background3D...');
        new Background3D();
    });
} else {
    console.log('📄 DOM ya cargado, iniciando Background3D...');
    new Background3D();
}
