        // ... (previous code) ...

        // Photo slideshow functionality
        function startPhotoSlideshow() {
            const slides = document.querySelectorAll('.photo-slide');
            let currentSlide = 0;
            let slideInterval;

            function nextSlide() {
                const currentElement = slides[currentSlide].querySelector('img, video');
                if (currentElement.tagName === 'VIDEO') {
                    currentElement.pause();
                    currentElement.currentTime = 0;
                }

                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');

                const nextElement = slides[currentSlide].querySelector('img, video');
                if (nextElement.tagName === 'VIDEO') {
                    clearInterval(slideInterval); // Stop timer
                    nextElement.play();
                    nextElement.onended = () => {
                        slideInterval = setInterval(nextSlide, 3000); // Restart timer
                        nextSlide();
                    };
                }
            }

            slideInterval = setInterval(nextSlide, 3000); // Change photo every 3 seconds
        }

        // No button - run away from cursor (keeps working even after Yes appears!)
        noBtn.addEventListener('mouseenter', (e) => {
            // Shake animation
            noBtn.classList.add('shake');
            setTimeout(() => noBtn.classList.remove('shake'), 300);

            // Play boop sound
            playBoopSound();

            // Show playful message
            showDodgeMessage(e.pageX, e.pageY);

            dodgeCount++;

            // After 10 dodges, reveal the Yes button (but No keeps dodging)
            if (dodgeCount === maxDodges && !yesButtonRevealed) {
                revealYesButton();
                yesButtonRevealed = true;
            }

            // Continue dodging regardless of whether Yes is visible
            const container = btnContainer.getBoundingClientRect();
            const button = noBtn.getBoundingClientRect();

            // Calculate safe boundaries (keeping button inside container area)
            const maxX = window.innerWidth - button.width - 100;
            const maxY = window.innerHeight - button.height - 100;
            const minX = 100;
            const minY = 100;

            // Generate random position away from current position
            let newX = Math.random() * (maxX - minX) + minX;
            let newY = Math.random() * (maxY - minY) + minY;

            // Ensure new position is far enough from current position
            const currentX = button.left;
            const currentY = button.top;
            const distance = Math.sqrt(Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2));

            if (distance < 200) {
                newX = currentX + (newX > currentX ? 250 : -250);
                newY = currentY + (newY > currentY ? 250 : -250);
            }

            // Clamp to boundaries
            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        });

        // Mobile touch support for No button
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();

            // Trigger the same behavior as mouseenter
            noBtn.classList.add('shake');
            setTimeout(() => noBtn.classList.remove('shake'), 300);

            playBoopSound();

            const touch = e.touches[0];
            showDodgeMessage(touch.pageX, touch.pageY);

            dodgeCount++;

            if (dodgeCount === maxDodges && !yesButtonRevealed) {
                revealYesButton();
                yesButtonRevealed = true;
            }

            const button = noBtn.getBoundingClientRect();
            const maxX = window.innerWidth - button.width - 50;
            const maxY = window.innerHeight - button.height - 50;
            const minX = 50;
            const minY = 50;

            let newX = Math.random() * (maxX - minX) + minX;
            let newY = Math.random() * (maxY - minY) + minY;

            newX = Math.max(minX, Math.min(maxX, newX));
            newY = Math.max(minY, Math.min(maxY, newY));

            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';
        });

        // Show playful dodge message
        function showDodgeMessage(x, y) {
            const message = document.createElement('div');
            message.className = 'dodge-message';
            message.textContent = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
            message.style.left = x + 'px';
            message.style.top = y + 'px';
            document.body.appendChild(message);

            setTimeout(() => message.remove(), 1500);
        }

        // Yes button - show success
        yesBtn.addEventListener('click', () => {
            playCelebrationSound();
            document.getElementById('bgMusic').play().catch(e => console.log("Audio play failed:", e)); // Catch autoplay errors
            questionSection.style.display = 'none';
            successMessage.classList.add('show');
            createBigConfetti();
            startPhotoSlideshow();
        });
        // Reveal Yes button with mini confetti
        function revealYesButton() {
            playChimeSound();
            yesBtn.classList.add('show');
            createMiniConfetti();
        }

        // Create minimal confetti effect when Yes appears (120 pieces!)
        function createMiniConfetti() {
            const colors = ['#f48fb1', '#ec407a', '#f8bbd0', '#e1bee7', '#ce93d8'];
            const yesBtnRect = yesBtn.getBoundingClientRect();
            const centerX = yesBtnRect.left + yesBtnRect.width / 2;
            const centerY = yesBtnRect.top + yesBtnRect.height / 2;

            for (let i = 0; i < 120; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'mini-confetti';
                    confetti.style.left = centerX + 'px';
                    confetti.style.top = centerY + 'px';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

                    // Random x offset for spread
                    const xOffset = (Math.random() - 0.5) * 300;
                    confetti.style.setProperty('--x-offset', xOffset + 'px');

                    document.body.appendChild(confetti);

                    setTimeout(() => confetti.remove(), 1500);
                }, i * 8);
            }
        }

        // Create BIG confetti explosion effect (1,200 pieces + FIREWORKS!)
        function createBigConfetti() {
            const colors = ['#f48fb1', '#ec407a', '#f8bbd0', '#e1bee7', '#ce93d8', '#ffd54f', '#ff8a65'];

            // Create massive waves of confetti raining down
            for (let wave = 0; wave < 5; wave++) {
                setTimeout(() => {
                    for (let i = 0; i < 240; i++) {
                        setTimeout(() => {
                            const confetti = document.createElement('div');
                            confetti.className = 'confetti';
                            confetti.style.left = Math.random() * 100 + '%';
                            confetti.style.top = '-10px';
                            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                            confetti.style.width = (Math.random() * 12 + 6) + 'px';
                            confetti.style.height = (Math.random() * 12 + 6) + 'px';
                            confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
                            document.body.appendChild(confetti);

                            setTimeout(() => confetti.remove(), 5000);
                        }, i * 10);
                    }
                }, wave * 400);
            }

            // Add firework bursts at random positions
            for (let burst = 0; burst < 15; burst++) {
                setTimeout(() => {
                    createFireworkBurst(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight * 0.6
                    );
                }, burst * 200);
            }
        }

        // Create a single firework burst at given position
        function createFireworkBurst(x, y) {
            const colors = ['#f48fb1', '#ec407a', '#ffd54f', '#ff8a65', '#e1bee7'];
            const particles = 30;

            for (let i = 0; i < particles; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = x + 'px';
                firework.style.top = y + 'px';
                firework.style.background = colors[Math.floor(Math.random() * colors.length)];

                // Random direction for burst
                const angle = (Math.PI * 2 * i) / particles;
                const velocity = Math.random() * 100 + 80;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;

                firework.style.setProperty('--tx', tx + 'px');
                firework.style.setProperty('--ty', ty + 'px');

                document.body.appendChild(firework);

                setTimeout(() => firework.remove(), 1500);
            }
        }
