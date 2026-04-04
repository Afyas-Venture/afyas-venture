document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuration: ONLY numbers, no + or 00
    const businessNumber = "923451004420"; 

    // 2. Select all order buttons
    const orderButtons = document.querySelectorAll('.product-card button');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent default if button is inside an <a> tag
            e.preventDefault();

            // Find the parent product card to get details
            const productCard = e.target.closest('.product-card') || e.target.closest('article');
            
            if (productCard) {
                // Extract Product Info
                const productName = productCard.querySelector('h3').innerText;
                const productPrice = productCard.querySelector('.price').innerText;
                
                // Find the nearest section title (e.g., Dubai Series)
                const section = productCard.closest('section');
                const seriesName = section ? section.querySelector('h2').innerText : "General Collection";

                // 3. Construct the Message using standard newlines (\n)
                const rawMessage = `Hello AFYAS Ventures! 👋\n\nI would like to order the following product:\n\n*Product:* ${productName}\n*Price:* ${productPrice}\n*Collection:* ${seriesName}\n\nPlease let me know the availability and delivery details. Thanks!`;

                // 4. THE FIX: Use encodeURIComponent to make it iPhone-compatible
                const encodedMessage = encodeURIComponent(rawMessage);

                // 5. Redirect to WhatsApp
                const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedMessage}`;
                
                // Use window.open for a cleaner 'new tab' experience
                window.open(whatsappUrl, '_blank' , 'noopener , noreferrer');
            }
        });
    });
});