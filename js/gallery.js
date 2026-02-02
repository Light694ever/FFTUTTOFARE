document.addEventListener('DOMContentLoaded', function() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img class="modal-image" src="" alt="Image preview">
            <div class="modal-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const modalImg = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    const closeButton = modal.querySelector('.close-modal');
    
    // Add click event to "Vedi Progetto" buttons
    galleryItems.forEach(item => {
        const viewProjectButton = item.querySelector('.view-project');
        const link = item.querySelector('a');
        
        if (viewProjectButton && link) {
            // Show image in modal when clicking "Vedi Progetto"
            viewProjectButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get image source and caption from the link
                const imgSrc = link.getAttribute('href');
                const imgCaption = link.getAttribute('data-title');
                
                // Set modal content
                modalImg.src = imgSrc;
                modalCaption.textContent = imgCaption;
                
                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
            
            // Add pointer cursor to show it's clickable
            viewProjectButton.style.cursor = 'pointer';
        }
    });
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
    
    // Make gallery items responsive for touch devices
    if ('ontouchstart' in window) {
        galleryItems.forEach(item => {
            item.classList.add('touch-device');
        });
    }
});
