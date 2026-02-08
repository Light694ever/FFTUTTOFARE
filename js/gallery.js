document.addEventListener('DOMContentLoaded', function() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <img class="modal-image" src="" alt="Image preview">
            <div class="modal-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const modalImg = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const closeButton = modal.querySelector('.close-modal');
    
    // Add click event to gallery items
    galleryItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (link) {
            // Function to open modal
            const openModal = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get image source and caption from the link
                const imgSrc = link.getAttribute('href');
                const imgCaption = link.getAttribute('data-title');
                
                // Set modal content
                modalImg.src = imgSrc;
                modalCaption.textContent = imgCaption;
                
                // Show modal with animation - double requestAnimationFrame ensures transition
                modal.style.display = 'flex';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        modal.classList.add('active');
                    });
                });
                document.body.style.overflow = 'hidden';
            };
            
            // Click on link
            link.addEventListener('click', openModal);
            
            // Click on entire item container (mobile friendly)
            item.addEventListener('click', openModal);
        }
    });
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Make gallery items responsive for touch devices
    if ('ontouchstart' in window) {
        galleryItems.forEach(item => {
            item.classList.add('touch-device');
        });
    }
});
