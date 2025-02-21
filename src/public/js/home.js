const socketClient = io();

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

const title = document.querySelector('#productTitle');
const description = document.querySelector('#description');
const price = document.querySelector('#price');
const productId = document.querySelector('#input-deleteProduct').value;

document.querySelector('#button-addProduct').addEventListener('submit', (event) => {
    event.preventDefault()
    socketClient.emit('newProduct', {title, description, price});
});

document.querySelector('#button-deleteProduct').addEventListener('submit', (event) => {
    event.preventDefault()
    socketClient.emit('deleteProduct', {productId})
});

 