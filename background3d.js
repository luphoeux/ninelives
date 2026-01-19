import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Background3D {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.logos = [];

        this.initThree();
        this.loadModel();
        this.addEventListeners();
        this.animate();
    }

    initThree() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(10, 10, 10);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xA4B5F2, 0.8);
        fillLight.position.set(-10, 5, -5);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x5753a3, 1.2);
        rimLight.position.set(0, -5, -10);
        this.scene.add(rimLight);

        const pointLight = new THREE.PointLight(0xA4B5F2, 2, 50);
        pointLight.position.set(0, 8, 5);
        this.scene.add(pointLight);
    }

    loadModel() {
        const loader = new GLTFLoader();

        loader.load(
            '3D/nivelives.glb',
            (gltf) => {
                const model = gltf.scene;

                const count = 8;
                for (let i = 0; i < count; i++) {
                    const logo = model.clone();

                    const angle = (i / count) * Math.PI * 2;
                    const radiusX = (7 + Math.random() * 3) * 1.5;
                    const radiusY = (3 + Math.random() * 1.5) * 1.5;

                    logo.position.x = Math.cos(angle) * radiusX;
                    logo.position.y = Math.sin(angle) * radiusY;
                    logo.position.z = (Math.random() - 0.5) * 6;

                    const scale = Math.random() * 2 + 1.2;
                    logo.scale.set(scale, scale, scale);

                    logo.rotation.x = Math.random() * Math.PI * 2;
                    logo.rotation.y = Math.random() * Math.PI * 2;
                    logo.rotation.z = Math.random() * Math.PI * 2;

                    this.applyMaterial(logo);
                    this.scene.add(logo);

                    this.logos.push({
                        mesh: logo,
                        baseX: logo.position.x,
                        baseY: logo.position.y,
                        baseZ: logo.position.z,
                        speedX: (Math.random() - 0.5) * 0.0015,
                        speedY: (Math.random() - 0.5) * 0.0015,
                        speedZ: (Math.random() - 0.5) * 0.0008,
                        rotationSpeed: (Math.random() - 0.5) * 0.002,
                        hoverOffset: Math.random() * Math.PI * 2
                    });
                }
                console.log("Background 3D: " + count + " items loaded.");
            },
            undefined,
            (error) => {
                console.error('Background 3D failure:', error);
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
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        emissive: 0xffffff,
                        emissiveIntensity: 1.5,
                        metalness: 0.1,
                        roughness: 0.5,
                        transparent: true,
                        opacity: 1
                    });
                } else {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x000000,
                        metalness: 0.2,
                        roughness: 0.4,
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

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                this.canvas.classList.add('blur-active');
            });
            heroSection.addEventListener('mouseleave', () => {
                this.canvas.classList.remove('blur-active');
            });
        }

        const observer = new MutationObserver(() => {
            this.logos.forEach(df => {
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

        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        const time = Date.now() * 0.001;

        this.logos.forEach((df, index) => {
            // Mouse influence
            df.mesh.position.x = df.baseX + this.mouse.x * 0.25;
            df.mesh.position.y = df.baseY + this.mouse.y * 0.25;

            // Avoidance Zone (Center of screen where text usually is)
            const distFromCenter = Math.sqrt(df.baseX * df.baseX + df.baseY * df.baseY);
            const avoidanceRadius = 6;
            if (distFromCenter < avoidanceRadius) {
                const angle = Math.atan2(df.baseY, df.baseX);
                const force = (avoidanceRadius - distFromCenter) * 0.05;
                df.baseX += Math.cos(angle) * force;
                df.baseY += Math.sin(angle) * force;
            }

            // Floating animation
            df.baseX += df.speedX;
            df.baseY += df.speedY;
            df.baseZ += df.speedZ;

            // Hovering effect
            df.mesh.position.y += Math.sin(time * 2 + df.hoverOffset) * 0.015;

            // Rotation
            df.mesh.rotation.y += df.rotationSpeed;
            df.mesh.rotation.x = Math.sin(time + index) * 0.1;

            // Collision detection with other logos
            this.logos.forEach((other, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = df.baseX - other.baseX;
                    const dy = df.baseY - other.baseY;
                    const dz = df.baseZ - other.baseZ;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    const minDistance = 3;

                    if (distance < minDistance) {
                        const angle = Math.atan2(dy, dx);
                        df.speedX = Math.cos(angle) * Math.abs(df.speedX);
                        df.speedY = Math.sin(angle) * Math.abs(df.speedY);
                        df.speedZ *= -1;
                    }
                }
            });

            // Boundaries
            if (Math.abs(df.baseX) > 15) df.speedX *= -1;
            if (Math.abs(df.baseY) > 8) df.speedY *= -1;
            if (Math.abs(df.baseZ) > 10) df.speedZ *= -1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Background3D();
});
