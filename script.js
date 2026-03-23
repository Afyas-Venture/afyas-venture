document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuration: Enter your business WhatsApp number here (with country code, no + or 00)
    const businessNumber = "+923433870899"; // Example: Dubai number

    // 2. Select all order buttons
    const orderButtons = document.querySelectorAll('.order-btn, button');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Find the parent product card to get details
            const productCard = e.target.closest('.product-card') || e.target.closest('article');
            
            if (productCard) {
                // Extract Product Info
                const productName = productCard.querySelector('h3').innerText;
                const productPrice = productCard.querySelector('.price').innerText;
                const seriesName = productCard.closest('section').querySelector('h2').innerText;

                // 3. Construct the Professional Message
                const message = `Hello AFYAS Ventures! 👋%0A%0AI would like to order the following product:%0A%0A*Product:* ${productName}%0A*Price:* ${productPrice}%0A*Collection:* ${seriesName}%0A%0APlease let me know the availability and delivery details. Thanks!`;

                // 4. Redirect to WhatsApp
                const whatsappUrl = `https://wa.me/${businessNumber}?text=${message}`;
                
                // Open in a new tab
                window.location.href = whatsappUrl; // This opens it in the same tab
            }
        });
    });
});