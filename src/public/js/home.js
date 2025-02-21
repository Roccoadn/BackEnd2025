const socketClient = io();

const addProduct = document.querySelector('#addProduct');
const deleteProduct = document.querySelector('#deleteProduct');
const productManager = {
    title: document.querySelector('#productTitle'),
    description: document.querySelector('#description'),
    price: document.querySelector('#price'),
    productId: document.querySelector('#id')
};

addProduct.addEventListener('submit', (event) => {
    event.preventDefault()
    const title = productManager.title.value;
    const description = productManager.description.value;
    const price = productManager.price.value;

    socketClient.emit('newProduct', { title, description, price });
    console.log('Producto enviado al servidor');
});

deleteProduct.addEventListener('submit', (event) => {
    event.preventDefault()
    const id = document.getElementById('NumeroProducto').value;

    try {
        const response = fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Producto eliminado:');
        } else {
            console.log('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});


fetch('http://localhost:8080/api/products')
.then(data => {return data.json()})
    .then(res =>{
        const container = document.querySelector('#products-container')
        res.forEach(product => {
        const div = document.createElement('div')
        div.setAttribute('id', `product-card`);
        div.innerHTML = `
        <img src="${product.thumbnails}" alt="${product.title}">
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <h2>${product.price}</h2>
        `
        
        container.appendChild(div)
    })
})

 