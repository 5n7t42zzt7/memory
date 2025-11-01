document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: DEFINE YOUR WORDS ---
    // This is the only part you need to edit!
    // Match the 'word', 'image' path, and 'audio' path.
    const wordsData = [
        { id: 1, word: 'כֶּלֶב', image: 'images/dog.png', audio: 'audio/dog.m4a' },
        { id: 2, word: 'חָתוּל', image: 'images/cat.png', audio: 'audio/cat.m4a' },
        { id: 3, word: 'כַּדוּר', image: 'images/ball.png', audio: 'audio/ball.m4a' },
        { id: 4, word: 'תַּפּוּחַ', image: 'images/apple.png', audio: 'audio/apple.m4a' }
        // Add more pairs here...
        // { id: 5, word: 'בַּיִת', image: 'images/house.png', audio: 'audio/house.m4a' },
    ];
    // ---------------------------------

    const gameBoard = document.querySelector('.game-board');
    const fireworksContainer = document.getElementById('fireworks-container'); // For match animation
    let cardPairs = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false; 
    let matchedPairs = 0; // For "game over" check
    const totalPairs = wordsData.length; // For "game over" check

    // --- New function to trigger fireworks ---
    function showFireworks() {
        fireworksContainer.classList.add('show');
        // Remove the class after 1 second (1000ms) so it can be triggered again
        setTimeout(() => {
            fireworksContainer.classList.remove('show');
        }, 1000); // Must match the animation duration from CSS
    }

    // Create card pairs (one word, one image)
    wordsData.forEach(item => {
        // Create the WORD card
        cardPairs.push({
            type: 'word',
            id: item.id,
            content: item.word,
            audio: item.audio
        });
        // Create the IMAGE card
        cardPairs.push({
            type: 'image',
            id: item.id,
            content: item.image,
            audio: item.audio
        });
    });

    // Shuffle the cards
    cardPairs.sort(() => 0.5 - Math.random());

    // Create and display cards on the board
    cardPairs.forEach(pair => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = pair.id;
        card.dataset.audio = pair.audio;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '❓'; // Card back content

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        // Set card front content (either image or word)
        if (pair.type === 'image') {
            const img = document.createElement('img');
            img.src = pair.content;
            cardFront.appendChild(img);
        } else {
            cardFront.classList.add('word-card');
            cardFront.textContent = pair.content;
        }

        card.appendChild(cardBack);
        card.appendChild(cardFront);

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });

    // Flip card function
    function flipCard(card) {
        if (lockBoard || card === firstCard || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');

        // --- Play the audio ---
        try {
            const audio = new Audio(card.dataset.audio);
            audio.play();
        } catch (e) {
            console.error("Could not play audio:", e);
        }

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        lockBoard = true;
        checkForMatch();
    }

    // Check if the two flipped cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.id === secondCard.dataset.id;
        isMatch ? disableCards() : unflipCards();
    }

    // It's a match! (With animation and "game over" logic)
    function disableCards() {
        
        matchedPairs++; // Increment match counter
        
        // 1. We have a match! Wait 1.2 seconds to let the child see it.
        setTimeout(() => {
            
            // 2. After 1.2s, show fireworks
            showFireworks();
            
            // 3. Flip the cards back over (triggers 0.6s flip animation)
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            // 4. Mark as matched (triggers 0.6s fade-out opacity)
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            // 5. Check if the game is over
            if (matchedPairs === totalPairs) {
                // Game is over! Play the "kol hakavod" sound.
                // We wait ~1.2s for the fireworks animation to finish before playing.
                setTimeout(() => {
                    try {
                        // Make sure you have "kolhakavod.m4a" in your /audio folder
                        const audio = new Audio('audio/kolhakavod.m4a');
                        audio.play();
                    } catch (e) {
                        console.error("Could not play 'kol hakavod' audio:", e);
                    }
                }, 1200); 
            }

            // 6. Reset the board after the animations are done (1s is safe)
            setTimeout(() => {
                resetBoard();
            }, 1000);

        }, 1200); // This is the 1.2-second delay to see the match
    }

    // Not a match
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 2200); // Wait 1.2 seconds before flipping back
    }

    // Reset turn variables
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

});
