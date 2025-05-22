// intro.js
document.addEventListener('DOMContentLoaded', function() {
    // Get all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Add click event listener to each card
    categoryCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Prevent default anchor behavior (just for testing)
            event.preventDefault();
            
            // Get the text content of the clicked card
            const categoryName = this.textContent;
            
            // Log the click
            console.log(`Category clicked: ${categoryName}`);
            
            // You can add more functionality here later
        });
    });
});