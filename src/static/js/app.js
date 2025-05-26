/* Global variables */
let flashcards = [];
let allFlashcards = []; // Store all flashcards for filtering
let currentStudyIndex = -1;
let currentStudyCards = [];
let cardToDelete = null;

// DOM Elements
const flashcardsContainer = document.getElementById('flashcards-container');
const studySetupContainer = document.getElementById('study-setup');
const studyContainer = document.getElementById('study-container');
const studyCard = document.getElementById('study-card');
const progressIndicator = document.getElementById('progress-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const categorySelect = document.getElementById('category-select');
const studyCategorySelect = document.getElementById('study-category-select');
const startStudyBtn = document.getElementById('start-study-btn');
const knowBtn = document.getElementById('know-btn');
const stillLearningBtn = document.getElementById('still-learning-btn');

// Modal Elements
const newCardModal = document.getElementById('new-card-modal');
const confirmModal = document.getElementById('confirm-modal');
const overlay = document.getElementById('overlay');
const flashcardForm = document.getElementById('flashcard-form');
const modalTitle = document.getElementById('modal-title');
const cardIdInput = document.getElementById('card-id');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const categoryInput = document.getElementById('category');
const difficultyInput = document.getElementById('difficulty');

// Button Elements
const newCardBtn = document.getElementById('new-card-btn');
const exitStudyBtn = document.getElementById('exit-study-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeConfirmBtn = document.getElementById('close-confirm-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const getStartedBtn = document.getElementById('get-started-btn');

// API Endpoints
const API_URL = '/api/flashcards';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchAllFlashcards();
    setupEventListeners();
});

// Fetch all flashcards from the API
async function fetchAllFlashcards() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            allFlashcards = data.flashcards;
            flashcards = [...allFlashcards]; // Start with all flashcards
            updateCategoryFilter();
            renderFlashcards();
            updateStats();
        } else {
            showError('Failed to fetch flashcards');
        }
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        showError('Network error. Please try again later.');
    }
}

// Filter flashcards by category
function filterFlashcardsByCategory(category) {
    if (!category) {
        // If no category or empty string, show all flashcards
        flashcards = [...allFlashcards];
    } else {
        // Filter by selected category
        flashcards = allFlashcards.filter(card => card.category === category);
    }
    renderFlashcards();
    updateStats();
}

// Update category filter dropdown with unique categories
function updateCategoryFilter() {
    // Update main category filter
    updateDropdown(categorySelect);
    
    // Update study category filter
    updateDropdown(studyCategorySelect);
}

// Update a dropdown with categories
function updateDropdown(dropdown) {
    if (!dropdown) return;
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Get unique categories from all flashcards
    const categories = [...new Set(allFlashcards.map(card => card.category).filter(Boolean))];
    
    // Add options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

// Update statistics on the home page
function updateStats() {
    const totalCardsCount = document.getElementById('total-cards-count');
    const categoriesCount = document.getElementById('categories-count');
    const reviewedCount = document.getElementById('reviewed-count');
    
    if (totalCardsCount) {
        totalCardsCount.textContent = allFlashcards.length;
    }
    
    if (categoriesCount) {
        const uniqueCategories = new Set(allFlashcards.map(card => card.category).filter(Boolean));
        categoriesCount.textContent = uniqueCategories.size;
    }
    
    if (reviewedCount) {
        // Count cards that have been reviewed at least once
        const reviewed = allFlashcards.filter(card => card.review_count && card.review_count > 0).length;
        reviewedCount.textContent = reviewed;
    }
}

// Render flashcards in the container
function renderFlashcards() {
    flashcardsContainer.innerHTML = '';
    
    if (flashcards.length === 0) {
        flashcardsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-lightbulb empty-icon"></i>
                <p>No flashcards yet. Create your first one!</p>
            </div>
        `;
        return;
    }
    
    flashcards.forEach(card => {
        const flashcardElement = createFlashcardElement(card);
        flashcardsContainer.appendChild(flashcardElement);
    });
}

// Create a flashcard DOM element
function createFlashcardElement(card) {
    const flashcardElement = document.createElement('div');
    flashcardElement.className = 'flashcard';
    flashcardElement.dataset.id = card.id;
    
    const difficultyClass = card.difficulty ? `difficulty-${card.difficulty}` : '';
    const learningStatusClass = card.learning_status ? `status-${card.learning_status}` : '';
    
    flashcardElement.innerHTML = `
        <div class="flashcard-inner">
            <div class="flashcard-front">
                ${card.category ? `<span class="card-category">${card.category}</span>` : ''}
                ${card.difficulty ? `<span class="card-difficulty ${difficultyClass}">${card.difficulty}</span>` : ''}
                <p class="question">${card.question}</p>
                ${card.learning_status ? `<span class="card-learning-status ${learningStatusClass}"><i class="fas ${card.learning_status === 'know' ? 'fa-check' : 'fa-sync'}"></i> ${card.learning_status === 'know' ? 'Know' : 'Still Learning'}</span>` : ''}
                <div class="card-actions">
                    <button class="card-btn edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="card-btn delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="flashcard-back">
                <p class="answer">${card.answer}</p>
            </div>
        </div>
    `;
    
    // Add event listener to flip the card
    flashcardElement.addEventListener('click', (e) => {
        // Don't flip if clicking on action buttons
        if (!e.target.closest('.card-actions') && !e.target.closest('.card-btn')) {
            flashcardElement.classList.toggle('flipped');
        }
    });
    
    // Add event listeners for edit and delete buttons
    const editBtn = flashcardElement.querySelector('.edit-btn');
    const deleteBtn = flashcardElement.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(card);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteConfirmation(card);
    });
    
    return flashcardElement;
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Get Started button
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            navigateToPage('cards');
        });
    }
    
    // New card button
    if (newCardBtn) {
        newCardBtn.addEventListener('click', () => openNewCardModal());
    }
    
    // Study mode buttons
    if (startStudyBtn) {
        startStudyBtn.addEventListener('click', () => {
            startStudyMode();
        });
    }
    
    if (exitStudyBtn) {
        exitStudyBtn.addEventListener('click', () => {
            exitStudyMode();
        });
    }
    
    // Learning status buttons
    if (knowBtn) {
        knowBtn.addEventListener('click', () => {
            markCardLearningStatus('know');
            // Always move to the next card's front side
            moveToNextCard();
        });
    }
    
    if (stillLearningBtn) {
        stillLearningBtn.addEventListener('click', () => {
            markCardLearningStatus('learning');
            // Always move to the next card's front side
            moveToNextCard();
        });
    }
    
    // Study navigation
    if (prevBtn && nextBtn && studyCard) {
        prevBtn.addEventListener('click', () => navigateStudyCards(-1));
        nextBtn.addEventListener('click', () => navigateStudyCards(1));
        studyCard.addEventListener('click', () => flipStudyCard());
    }
    
    // Modal controls
    if (closeModalBtn && cancelBtn) {
        closeModalBtn.addEventListener('click', () => closeModal(newCardModal));
        cancelBtn.addEventListener('click', () => closeModal(newCardModal));
    }
    
    if (closeConfirmBtn && cancelDeleteBtn && confirmDeleteBtn) {
        closeConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
        cancelDeleteBtn.addEventListener('click', () => closeModal(confirmModal));
        confirmDeleteBtn.addEventListener('click', () => deleteFlashcard());
    }
    
    // Form submission
    if (flashcardForm) {
        flashcardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveFlashcard();
        });
    }
    
    // Category filter
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            filterFlashcardsByCategory(categorySelect.value);
        });
    }
    
    // Close modals when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeModal(newCardModal);
            closeModal(confirmModal);
        });
    }
}

// Navigate to a specific page
function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active-page');
    });
    
    // Show the selected page
    const selectedPage = document.getElementById(`${page}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active-page');
    }
    
    // Update navigation
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Special handling for study page
    if (page === 'study') {
        // Reset study mode to setup view
        studySetupContainer.classList.remove('hidden');
        studyContainer.classList.add('hidden');
        
        // Refresh category dropdown
        updateCategoryFilter();
    }
    
    // Update stats when navigating to home page
    if (page === 'home') {
        // Always fetch fresh data when navigating to home page
        fetchAllFlashcards();
    }
}

// Open the new card modal
function openNewCardModal() {
    modalTitle.textContent = 'Create New Flashcard';
    cardIdInput.value = '';
    flashcardForm.reset();
    openModal(newCardModal);
}

// Open the edit modal with card data
function openEditModal(card) {
    modalTitle.textContent = 'Edit Flashcard';
    cardIdInput.value = card.id;
    questionInput.value = card.question;
    answerInput.value = card.answer;
    categoryInput.value = card.category || '';
    difficultyInput.value = card.difficulty || 'easy';
    openModal(newCardModal);
}

// Open the delete confirmation modal
function openDeleteConfirmation(card) {
    cardToDelete = card;
    openModal(confirmModal);
}

// Open a modal
function openModal(modal) {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

// Close a modal
function closeModal(modal) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Save a flashcard (create or update)
async function saveFlashcard() {
    const cardId = cardIdInput.value;
    const isEdit = !!cardId;
    
    const cardData = {
        question: questionInput.value,
        answer: answerInput.value,
        category: categoryInput.value,
        difficulty: difficultyInput.value
    };
    
    try {
        let response;
        
        if (isEdit) {
            // Update existing card
            response = await fetch(`${API_URL}/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            });
        } else {
            // Create new card
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            closeModal(newCardModal);
            // Refresh all flashcards after saving
            fetchAllFlashcards();
            // Maintain current category filter if any
            if (categorySelect.value) {
                categorySelect.value = cardData.category;
            }
        } else {
            showError(data.message || 'Failed to save flashcard');
        }
    } catch (error) {
        console.error('Error saving flashcard:', error);
        showError('Network error. Please try again later.');
    }
}

// Delete a flashcard
async function deleteFlashcard() {
    if (!cardToDelete) return;
    
    try {
        const response = await fetch(`${API_URL}/${cardToDelete.id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal(confirmModal);
            // Refresh all flashcards after deletion
            fetchAllFlashcards();
        } else {
            showError(data.message || 'Failed to delete flashcard');
        }
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        showError('Network error. Please try again later.');
    }
    
    cardToDelete = null;
}

// Start study mode
function startStudyMode() {
    if (allFlashcards.length === 0) {
        showError('No flashcards available to study');
        return;
    }
    
    // Filter by selected category if any
    const selectedCategory = studyCategorySelect.value;
    currentStudyCards = selectedCategory 
        ? allFlashcards.filter(card => card.category === selectedCategory)
        : [...allFlashcards];
    
    if (currentStudyCards.length === 0) {
        showError('No flashcards available in this category');
        return;
    }
    
    // Hide setup and show study container
    studySetupContainer.classList.add('hidden');
    studyContainer.classList.remove('hidden');
    
    // Shuffle the cards
    shuffleArray(currentStudyCards);
    
    // Reset study state
    currentStudyIndex = -1;
    updateStudyControls();
    
    // Start with the first card
    navigateStudyCards(1);
}

// Exit study mode
function exitStudyMode() {
    // Show setup and hide study container
    studySetupContainer.classList.remove('hidden');
    studyContainer.classList.add('hidden');
    
    // Refresh flashcards to update stats
    fetchAllFlashcards();
}

// Move to the next card (always showing front side)
function moveToNextCard() {
    // Ensure we're not at the end
    if (currentStudyIndex >= currentStudyCards.length - 1) {
        // End of study session
        showEndOfStudyMessage();
        return;
    }
    
    // Increment index
    currentStudyIndex++;
    
    // Make sure card is showing front side
    studyCard.classList.remove('flipped');
    
    // Update the study card and controls
    updateStudyCard();
    updateStudyControls();
}

// Navigate through study cards
function navigateStudyCards(direction) {
    // Update index
    currentStudyIndex += direction;
    
    // Ensure index is within bounds
    if (currentStudyIndex < 0) {
        currentStudyIndex = 0;
    } else if (currentStudyIndex >= currentStudyCards.length) {
        // End of study session
        showEndOfStudyMessage();
        return;
    }
    
    // Make sure card is showing front side when navigating
    studyCard.classList.remove('flipped');
    
    // Update the study card
    updateStudyCard();
    updateStudyControls();
}

// Update the study card with current card data
function updateStudyCard() {
    const card = currentStudyCards[currentStudyIndex];
    
    // Update content
    const questionElement = studyCard.querySelector('.question');
    const answerElement = studyCard.querySelector('.answer');
    
    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    
    // Show learning status buttons
    const learningStatusButtons = studyCard.querySelector('.learning-status-buttons');
    if (learningStatusButtons) {
        learningStatusButtons.style.display = 'flex';
    }
}

// Update study controls (buttons and progress)
function updateStudyControls() {
    // Update progress indicator
    progressIndicator.textContent = `Card ${currentStudyIndex + 1} of ${currentStudyCards.length}`;
    
    // Update button states
    prevBtn.disabled = currentStudyIndex <= 0;
    nextBtn.disabled = currentStudyIndex >= currentStudyCards.length;
}

// Flip the study card
function flipStudyCard() {
    studyCard.classList.toggle('flipped');
    
    // If card is flipped to back, mark as reviewed
    if (studyCard.classList.contains('flipped') && currentStudyIndex >= 0) {
        const cardId = currentStudyCards[currentStudyIndex].id;
        markCardAsReviewed(cardId);
    }
}

// Mark a card as reviewed
async function markCardAsReviewed(cardId) {
    try {
        const response = await fetch(`${API_URL}/${cardId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update the card in our local arrays with the returned data
            if (data.success && data.flashcard) {
                // Update in allFlashcards array
                const cardIndex = allFlashcards.findIndex(card => card.id === cardId);
                if (cardIndex >= 0) {
                    allFlashcards[cardIndex] = data.flashcard;
                }
                
                // Update in flashcards array if it exists there
                const currentCardIndex = flashcards.findIndex(card => card.id === cardId);
                if (currentCardIndex >= 0) {
                    flashcards[currentCardIndex] = data.flashcard;
                }
                
                // Update in currentStudyCards array
                const studyCardIndex = currentStudyCards.findIndex(card => card.id === cardId);
                if (studyCardIndex >= 0) {
                    currentStudyCards[studyCardIndex] = data.flashcard;
                }
                
                // Update stats to reflect the new review
                updateStats();
            }
        }
    } catch (error) {
        console.error('Error marking card as reviewed:', error);
    }
}

// Mark card learning status
function markCardLearningStatus(status) {
    if (currentStudyIndex < 0 || currentStudyIndex >= currentStudyCards.length) {
        return;
    }
    
    const cardId = currentStudyCards[currentStudyIndex].id;
    
    // Update the card on the server
    updateCardLearningStatus(cardId, status);
}

// Update card learning status on the server
async function updateCardLearningStatus(cardId, status) {
    try {
        const response = await fetch(`${API_URL}/${cardId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ learning_status: status })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update the card in our local arrays with the returned data
            if (data.success && data.flashcard) {
                // Update in allFlashcards array
                const cardIndex = allFlashcards.findIndex(card => card.id === cardId);
                if (cardIndex >= 0) {
                    allFlashcards[cardIndex] = data.flashcard;
                }
                
                // Update in flashcards array if it exists there
                const currentCardIndex = flashcards.findIndex(card => card.id === cardId);
                if (currentCardIndex >= 0) {
                    flashcards[currentCardIndex] = data.flashcard;
                }
                
                // Update in currentStudyCards array
                const studyCardIndex = currentStudyCards.findIndex(card => card.id === cardId);
                if (studyCardIndex >= 0) {
                    currentStudyCards[studyCardIndex] = data.flashcard;
                }
                
                // Update stats to reflect the new review
                updateStats();
            }
        }
    } catch (error) {
        console.error('Error updating card learning status:', error);
    }
}

// Show end of study message
function showEndOfStudyMessage() {
    studyCard.classList.remove('flipped');
    const questionElement = studyCard.querySelector('.question');
    const answerElement = studyCard.querySelector('.answer');
    
    questionElement.textContent = 'Study session complete!';
    answerElement.textContent = 'You have reviewed all cards in this session.';
    
    // Hide learning status buttons at the end
    const learningStatusButtons = studyCard.querySelector('.learning-status-buttons');
    if (learningStatusButtons) {
        learningStatusButtons.style.display = 'none';
    }
    
    progressIndicator.textContent = `Completed ${currentStudyCards.length} cards`;
    prevBtn.disabled = false;
    nextBtn.disabled = true;
    
    // Refresh flashcards to update stats
    fetchAllFlashcards();
}

// Show error message
function showError(message) {
    alert(message); // Simple alert for now, could be improved with a toast notification
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
