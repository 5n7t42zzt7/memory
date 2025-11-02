document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: DEFINE YOUR WORDS ---
    const wordsData = [
        { id: 1, word: 'כֶּלֶב', image: 'images/dog.png', audio: 'audio/dog.m4a' },
        { id: 2, word: 'חָתוּל', image: 'images/cat.png', audio: 'audio/cat.m4a' },
        { id: 3, word: 'כַּדוּר', image: 'images/ball.png', audio: 'audio/ball.m4a' },
        { id: 4, word: 'תַּפּוּחַ', image: 'images/apple.png', audio: 'audio/apple.m4a' }
        // Add more pairs here...
    ];
    // ---------------------------------

    // --- NEW: Play startup sound ---
    try {
        // Make sure "comeandplay.m4a" is in your /audio folder
        const startAudio = new Audio('audio/comeandplay.m4a');
        startAudio.play();
    } catch (e) {
        console.error("Could not play startup audio:", e);
    }
    // --- End of new code ---

    const gameBoard = document.querySelector('.game-board');
    const fireworksContainer = document.getElementById('fireworks-container'); 
    let cardPairs = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false; 
    let matchedPairs = 0; 
    const totalPairs = wordsData.length; 

    // --- Function to trigger fireworks ---
    function showFireworks() {
        fireworksContainer.classList.add('show');
        setTimeout(() => {
            fireworksContainer.classList.remove('show');
        }, 1000); 
    }

    // Create card pairs
    wordsData.forEach(item => {
        cardPairs.push({
            type: 'word',
            id: item.id,
            content: item.word,
            audio: item.audio
        });
        cardPairs.push({
            type: 'image',
            id: item.id,
            content: item.image,
            audio: item.audio
        });
    });

    // Shuffle the cards
    cardPairs.sort(() => 0.5 - Math.random());

    // Create and display cards
    cardPairs.forEach(pair => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = pair.id;
        card.dataset.audio = pair.audio;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '❓';

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

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

    // Check for match
    function checkForMatch() {
        const isMatch = firstCard.dataset.id === secondCard.dataset.id;
        isMatch ? disableCards() : unflipCards();
    }

    // It's a match!
    function disableCards() {
        matchedPairs++; 
        setTimeout(() => {
            showFireworks();
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    try {
                        const audio = new Audio('audio/kolhakavod.m4a');
                        audio.play();
                    } catch (e) {
                        console.error("Could not play 'kol hakavod' audio:", e);
                    }
                }, 1200); 
            }
            setTimeout(() => {
                resetBoard();
            }, 1000);
        }, 1200); 
    }

    // Not a match
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 2200); // 2.2-second delay for wrong pairs
    }

    // Reset turn
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
});