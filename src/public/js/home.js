const socketClient = io();

function renderProducts(products) {
    const container = document.querySelector('#products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
        <img src="${product.thumbnails}" alt="${product.title}">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <h2>${product.price}</h2>    
        `;
        container.appendChild(div);
    });
}

socketClient.on ('realTimeProducts', (products) => {
    renderProducts(products);
})

document.querySelector('#add-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.querySelector('#productTitle').value;
    const description = document.querySelector('#description').value;
    const price = document.querySelector('#price').value;

    socketClient.emit('newProduct', { title, description, price });

    document.querySelector('#productTitle').value = "";
    document.querySelector('#description').value = "";
    document.querySelector('#price').value = "";
});

document.querySelector('#delete-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const productId = document.querySelector('#input-deleteProduct').value;

    socketClient.emit('deleteProduct', { productId });

    document.querySelector('#input-deleteProduct').value = "";
});
 