const searchPage = document.getElementById('searchPage');
const resultsPage = document.getElementById('resultsPage');
const bludditPage = document.getElementById('bludditPage');
const searchInput = document.getElementById('searchInput');
const resultsSearchInput = document.getElementById('resultsSearchInput');

// Gallery variables
let currentIndex = 0;
let currentZoom = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;
let initialDistance = 0;
let initialZoom = 1;

// Gallery images
const galleryImages = [
    { src: '1.png', alt: 'Фото 1: Главный вход' },
    { src: '5.png', alt: 'Фото 2: Внутренние помещения' }
];

// Search functionality
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        resultsSearchInput.value = query;
        searchPage.style.display = 'none';
        resultsPage.style.display = 'block';
        bludditPage.style.display = 'none';
        window.scrollTo(0, 0);
    }
}

// Enter key search
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

resultsSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Go back to search
function goToSearch() {
    searchPage.style.display = 'flex';
    resultsPage.style.display = 'none';
    bludditPage.style.display = 'none';
    closeGallery();
    searchInput.value = '';
    searchInput.focus();
}

// Go to results (from Bluddit)
function goToResults() {
    searchPage.style.display = 'none';
    resultsPage.style.display = 'block';
    bludditPage.style.display = 'none';
    closeGallery();
    window.scrollTo(0, 0);
}

// Open Bluddit post
function openBluddit() {
    searchPage.style.display = 'none';
    resultsPage.style.display = 'none';
    bludditPage.style.display = 'block';
    window.scrollTo(0, 0);
}

// Open image gallery
function openGallery(index) {
    currentIndex = index;
    createGalleryModal();
    updateGalleryImage();
}

// Create gallery modal
function createGalleryModal() {
    // Remove existing modal if any
    const existingModal = document.querySelector('.gallery-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="gallery-modal-content">
            <span class="gallery-close" onclick="closeGallery()">&times;</span>
            <div class="gallery-counter" id="galleryCounter">${currentIndex + 1} / ${galleryImages.length}</div>
            <button class="gallery-prev" onclick="changeGalleryImage(-1)">&#10094;</button>
            <button class="gallery-next" onclick="changeGalleryImage(1)">&#10095;</button>
            <div class="gallery-img-container" id="galleryImgContainer">
                <img id="galleryImg" src="" alt="">
            </div>
            <div class="gallery-caption" id="galleryCaption"></div>
            <div class="gallery-controls">
                <button class="zoom-btn" onclick="zoomOut()">−</button>
                <button class="zoom-btn" onclick="resetZoom()">⟲</button>
                <button class="zoom-btn" onclick="zoomIn()">+</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add touch events for pinch zoom
    setupTouchEvents();
}

// Update gallery image
function updateGalleryImage() {
    const img = document.getElementById('galleryImg');
    const caption = document.getElementById('galleryCaption');
    const counter = document.getElementById('galleryCounter');
    
    if (img && caption && counter) {
        img.src = galleryImages[currentIndex].src;
        caption.textContent = galleryImages[currentIndex].alt;
        counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        resetZoom();
    }
}

// Change gallery image
function changeGalleryImage(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = galleryImages.length - 1;
    } else if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
    }
    updateGalleryImage();
}

// Close gallery
function closeGallery() {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        modal.remove();
    }
    resetZoom();
}

// Zoom functions
function zoomIn() {
    currentZoom += 0.5;
    if (currentZoom > 5) currentZoom = 5;
    updateZoom();
}

function zoomOut() {
    currentZoom -= 0.5;
    if (currentZoom < 1) {
        currentZoom = 1;
        panX = 0;
        panY = 0;
    }
    updateZoom();
}

function resetZoom() {
    currentZoom = 1;
    panX = 0;
    panY = 0;
    updateZoom();
}

function updateZoom() {
    const img = document.getElementById('galleryImg');
    if (img) {
        img.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
    }
}

// Touch events for pinch zoom and pan
function setupTouchEvents() {
    const container = document.getElementById('galleryImgContainer');
    const img = document.getElementById('galleryImg');
    
    if (!container || !img) return;

    // Touch start
    container.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // Pinch zoom
            initialDistance = getDistance(e.touches);
            initialZoom = currentZoom;
        } else if (e.touches.length === 1) {
            // Pan
            isDragging = true;
            startX = e.touches[0].clientX - panX;
            startY = e.touches[0].clientY - panY;
            img.style.cursor = 'grabbing';
        }
    }, { passive: false });

    // Touch move
    container.addEventListener('touchmove', function(e) {
        e.preventDefault();
        
        if (e.touches.length === 2 && initialDistance > 0) {
            // Pinch zoom
            const currentDistance = getDistance(e.touches);
            const scale = currentDistance / initialDistance;
            currentZoom = Math.min(Math.max(initialZoom * scale, 1), 5);
            updateZoom();
        } else if (e.touches.length === 1 && isDragging && currentZoom > 1) {
            // Pan
            panX = e.touches[0].clientX - startX;
            panY = e.touches[0].clientY - startY;
            
            // Limit pan bounds
            const maxPanX = (img.offsetWidth * currentZoom - window.innerWidth) / 2;
            const maxPanY = (img.offsetHeight * currentZoom - window.innerHeight) / 2;
            
            panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
            panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
            
            updateZoom();
        }
    }, { passive: false });

    // Touch end
    container.addEventListener('touchend', function(e) {
        isDragging = false;
        initialDistance = 0;
        img.style.cursor = 'grab';
    });

    // Double tap to zoom
    let lastTap = 0;
    container.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            if (currentZoom === 1) {
                currentZoom = 2;
            } else {
                resetZoom();
            }
            updateZoom();
        }
        lastTap = currentTime;
    });

    // Mouse events for desktop
    container.addEventListener('mousedown', function(e) {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
            img.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging && currentZoom > 1) {
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            
            const maxPanX = (img.offsetWidth * currentZoom - window.innerWidth) / 2;
            const maxPanY = (img.offsetHeight * currentZoom - window.innerHeight) / 2;
            
            panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
            panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
            
            updateZoom();
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        if (img) img.style.cursor = 'grab';
    });

    // Mouse wheel zoom
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            currentZoom = Math.min(currentZoom + 0.5, 5);
        } else {
            currentZoom = Math.max(currentZoom - 0.5, 1);
            if (currentZoom === 1) {
                panX = 0;
                panY = 0;
            }
        }
        updateZoom();
    }, { passive: false });
}

// Calculate distance between two touch points
function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.querySelector('.gallery-modal');
    if (modal) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowLeft') {
            changeGalleryImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeGalleryImage(1);
        } else if (e.key === '+' || e.key === '=') {
            zoomIn();
        } else if (e.key === '-') {
            zoomOut();
        } else if (e.key === '0') {
            resetZoom();
        }
    }
});

// Focus search input on load
window.onload = function() {
    if (searchInput) {
        searchInput.focus();
    }
};
