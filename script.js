document.addEventListener('DOMContentLoaded', () => {
    
    const businessNumber = "923469160100"; 

    // 2. Select all order buttons
    const orderButtons = document.querySelectorAll('.product-card button');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent default behavior
            e.preventDefault();

            // Find the parent product card
            const productCard = e.target.closest('.product-card') || e.target.closest('article');
            
            if (productCard) {
                // Extract Product Info
                const productName = productCard.querySelector('h3').innerText;
                const productPrice = productCard.querySelector('.price').innerText;
                
                // NEW: Find the selected size from the radio buttons
                // This looks for the checked radio input specifically inside THIS card
                const selectedSizeInput = productCard.querySelector('input[type="radio"]:checked');
                const sizeLabel = selectedSizeInput ? selectedSizeInput.value : "Not Specified";

                // Find the nearest section title (e.g., Dubai Series)
                const section = productCard.closest('section');
                const seriesName = section ? section.querySelector('h2').innerText : "General Collection";

                // 3. Construct the Message (Updated to include Size)
                const rawMessage = `Hello AFYAS Ventures! 👋\n\nI would like to order the following product:\n\n*Product:* ${productName}\n*Size:* ${sizeLabel}\n*Price:* ${productPrice}\n*Collection:* ${seriesName}\n\nPlease let me know the availability and delivery details. Thanks!`;

                // 4. Encode for iPhone compatibility
                const encodedMessage = encodeURIComponent(rawMessage);

                // 5. Redirect to WhatsApp
                const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedMessage}`;
                
                // Open with security parameters
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }
        });
    });
});