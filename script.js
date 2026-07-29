document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DE DIAPOSITIVAS (SLIDES) ---
    const slides = document.querySelectorAll('.slide');
    const navIndicators = document.getElementById('nav-indicators');
    let currentSlide = 0;

    // Crear indicadores de navegación
    slides.forEach(function(_, index) {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (index === 0) dot.classList.add('active');
        if (navIndicators) navIndicators.appendChild(dot);
    });
    
    const indicators = document.querySelectorAll('.indicator');

    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        slides[currentSlide].classList.remove('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

        // Disparar eventos específicos de la diapositiva
        triggerSlideEvents(currentSlide);
    }

    // Botones de navegación
    const startPitchBtn = document.querySelector('.start-pitch');
    if (startPitchBtn) {
        startPitchBtn.addEventListener('click', function() { 
            goToSlide(1); 
        });
    }
    
    const nextButtons = document.querySelectorAll('.next-slide');
    nextButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            goToSlide(currentSlide + 1);
        });
    });

    // --- EVENTOS ESPECÍFICOS POR DIAPOSITIVA ---
    function triggerSlideEvents(index) {
        // Slide 2: Revelación de Narrativa
        if (index === 1) {
            const narrativeTexts = document.querySelectorAll('.reveal-text');
            narrativeTexts.forEach(function(text, i) {
                setTimeout(function() {
                    text.classList.add('visible');
                }, i * 1200); // Aparecen cada 1.2 segundos
            });
        }
        
        // Slide 5: Animación de Finanzas (Contadores)
        if (index === 4) {
            const numbers = document.querySelectorAll('.big-number');
            numbers.forEach(function(num) {
                const target = +num.getAttribute('data-target');
                animateValue(num, 0, target, 2000); // 2 segundos de duración
            });
        }
    }

    // Función para animar contadores financieros
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = function(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Función ease-out
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOutQuart * (end - start) + start);
            
            // Formatear como moneda o número simple
            if (end > 1000000) {
                obj.innerHTML = '$' + currentVal.toLocaleString('en-US');
            } else {
                obj.innerHTML = currentVal.toLocaleString('en-US');
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (end > 1000000) obj.innerHTML = '$' + end.toLocaleString('en-US');
                else obj.innerHTML = end.toLocaleString('en-US');
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- SISTEMA DE PARTÍCULAS DE FONDO (CANVAS) ---
    const canvas = document.getElementById('cosmos-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = Math.random() > 0.8 ? '#8c00ff' : '#00e5ff'; 
                this.opacity = Math.random();
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Reaparecer al salir de los bordes
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = Math.floor((canvas.width * canvas.height) / 8000);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Efecto de rastro espacial
            ctx.fillStyle = 'rgba(2, 5, 15, 0.2)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(function(particle) {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
