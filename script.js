document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const proposalCard = document.getElementById('proposal-card');
    const successCard = document.getElementById('success-card');
    const premiumModal = document.getElementById('premium-modal');
    
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const btnRestart = document.getElementById('btn-restart');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnPayPremium = document.getElementById('btn-pay-premium');
    const btnBackToYes = document.getElementById('btn-back-to-yes');
    const heartsContainer = document.getElementById('hearts-container');

    let escapeAttempts = 0;

    // --- Floating Hearts Background ---
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Use different FontAwesome heart styles randomly
        const heartIcons = [
            'fa-solid fa-heart',
            'fa-solid fa-heart-pulse',
            'fa-regular fa-heart'
        ];
        const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        
        heart.innerHTML = `<i class="${randomIcon}"></i>`;
        
        // Random horizontal position (0 to 100% of viewport width)
        heart.style.left = `${Math.random() * 100}vw`;
        
        // Random size (0.8rem to 2rem)
        const size = Math.random() * 1.2 + 0.8;
        heart.style.fontSize = `${size}rem`;
        
        // Random animation duration (6s to 12s)
        const duration = Math.random() * 6 + 6;
        heart.style.animationDuration = `${duration}s`;
        
        // Random delay
        heart.style.animationDelay = `${Math.random() * 2}s`;
        
        heartsContainer.appendChild(heart);
        
        // Remove from DOM when animation completes
        setTimeout(() => {
            heart.remove();
        }, (duration + 2) * 1000);
    }

    // Generate initial hearts and schedule continuous generation
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingHeart, i * 400);
    }
    setInterval(createFloatingHeart, 800);

    // --- Runaway NO Button Logic ---
    function escapeNoButton(e) {
        escapeAttempts++;
        
        // Get viewable bounds minus button size
        const padding = 30;
        const btnWidth = btnNo.offsetWidth || 140;
        const btnHeight = btnNo.offsetHeight || 56;
        
        // If it's desktop, avoid placing the button directly under the mouse pointer
        const mouseX = e.clientX || window.innerWidth / 2;
        const mouseY = e.clientY || window.innerHeight / 2;
        
        let newX, newY;
        let distance = 0;
        
        // Try up to 10 times to find a spot that is far enough from current mouse pointer
        let tries = 0;
        do {
            newX = Math.max(padding, Math.floor(Math.random() * (window.innerWidth - btnWidth - padding * 2)));
            newY = Math.max(padding, Math.floor(Math.random() * (window.innerHeight - btnHeight - padding * 2)));
            
            // Calculate distance to mouse
            const dx = newX + btnWidth / 2 - mouseX;
            const dy = newY + btnHeight / 2 - mouseY;
            distance = Math.sqrt(dx * dx + dy * dy);
            tries++;
        } while (distance < 150 && tries < 10);

        btnNo.classList.add('btn-no-escaped');
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;

        // Add a cute little micro-rotation for extra premium feel
        const randomRotate = (Math.random() * 20) - 10;
        btnNo.style.transform = `rotate(${randomRotate}deg)`;
    }

    // Attach escaping behavior to hover and touch events
    btnNo.addEventListener('mouseenter', escapeNoButton);
    btnNo.addEventListener('pointerenter', escapeNoButton);

    // Handle clicks on NO (if they somehow manage to click it, e.g. via keyboard navigation or lightning speed)
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        showPremiumModal();
    });

    // --- Modal Logic ---
    function showPremiumModal() {
        premiumModal.classList.remove('hidden');
        // Small delay to allow the CSS display change to register before triggering animation class
        setTimeout(() => {
            premiumModal.classList.add('active');
        }, 10);
    }

    function closePremiumModal() {
        premiumModal.classList.remove('active');
        setTimeout(() => {
            premiumModal.classList.add('hidden');
        }, 400); // match transition duration
    }

    btnCloseModal.addEventListener('click', closePremiumModal);
    
    // Close modal if user clicks outside of the content card
    premiumModal.addEventListener('click', (e) => {
        if (e.target === premiumModal) {
            closePremiumModal();
        }
    });

    // Pay Premium action (simulated payment process)
    btnPayPremium.addEventListener('click', () => {
        // Change button state to "processing"
        const originalContent = btnPayPremium.innerHTML;
        btnPayPremium.disabled = true;
        btnPayPremium.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando pago...`;
        
        setTimeout(() => {
            // Restore button
            btnPayPremium.disabled = false;
            btnPayPremium.innerHTML = originalContent;
            
            // Show funny custom error alert
            alert("❌ ¡TRANSACCIÓN RECHAZADA!\n\n" + 
                  "Motivo: Se ha detectado un nivel crítico de AMOR en la tarjeta emisora.\n\n" + 
                  "El banco no permite transacciones destinadas a rechazar al remitente. Por favor, selecciona 'SÍ' (gratis) para proceder.");
            
            // Auto close modal and trigger YES action
            closePremiumModal();
            triggerYesAnimation();
        }, 2000);
    });

    // Back to Yes button in modal
    btnBackToYes.addEventListener('click', () => {
        closePremiumModal();
        triggerYesAnimation();
    });

    // --- YES Button Logic ---
    function triggerYesAnimation() {
        // Hide proposal card
        proposalCard.classList.remove('active');
        proposalCard.classList.add('hidden');

        // Reset No button location
        resetNoButton();

        // Show success card with delay
        setTimeout(() => {
            successCard.classList.remove('hidden');
            // Small timeout to allow transition to trigger
            setTimeout(() => {
                successCard.classList.add('active');
                successCard.classList.add('fade-in');
            }, 50);
            
            // Trigger Confetti Explosion
            launchConfettiEffects();
        }, 300);
    }

    btnYes.addEventListener('click', triggerYesAnimation);

    // --- Confetti Animations (Canvas Confetti) ---
    function launchConfettiEffects() {
        // First big blast
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff477e', '#ff7096', '#ff85a1', '#f9d423', '#ffffff']
        });

        // Continuous heart-like side cannons
        const duration = 4 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#ff477e', '#ff85a1', '#f9d423']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#ff477e', '#ff85a1', '#f9d423']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // --- Reset / Restart Logic ---
    function resetNoButton() {
        btnNo.classList.remove('btn-no-escaped');
        btnNo.style.position = '';
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.style.transform = '';
        escapeAttempts = 0;
    }

    btnRestart.addEventListener('click', () => {
        // Hide success card
        successCard.classList.remove('active');
        successCard.classList.add('hidden');

        // Show proposal card
        setTimeout(() => {
            proposalCard.classList.remove('hidden');
            setTimeout(() => {
                proposalCard.classList.add('active');
            }, 50);
        }, 300);
    });
});
