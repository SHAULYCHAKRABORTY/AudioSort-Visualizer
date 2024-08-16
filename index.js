// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Get all elements with the class 'box-btn'
    const buttons = document.querySelectorAll('.box-btn');
    
    // Add click event listeners to each button
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log(`${event.target.textContent} button clicked`);
            // Add additional functionality here if needed
        });
    });
});
