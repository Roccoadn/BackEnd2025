import { api } from '../constants/environments.js'
const { apiUrl, productsEndpoint, logoImage} = api;

let currentPage = 1;
const limit = 6;

async function getProducts(page) {
    try {
        const url = `${apiUrl + productsEndpoint}?page=${page}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();

        renderProducts(data.payload);
    
        document.getElementById("pageInfo").textContent = `Página ${data.page} de ${data.totalPages}`;
        document.getElementById("prevPage").disabled = !data.hasPrevPage;
        document.getElementById("nextPage").disabled = !data.hasNextPage;
        document.getElementById("prevPage").onclick = () => getProducts(data.prevPage);
        document.getElementById("nextPage").onclick = () => getProducts(data.nextPage);
        currentPage = data.page;
    } catch (e) {
        console.error("Error al cargar productos:", e);
    }
}

function renderProducts(data) {
    const container = document.querySelector('#products-container');
    container.innerHTML = '';

    data.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <h2>$${product.price}</h2>  
            <a href="/api/products/productsDetail/${product._id}">Ver Detalles</a>  
        `;
        const addCartButton = document.createElement('button');
        addCartButton.classList.add('add-cart-button');
        addCartButton.innerText = 'Agregar al carrito';
        
        addCartButton.addEventListener('click', async () => {
            const cartId = '67ca2b7d13c9804b87109f34';
            const productId = product._id;
            
            const url = `/api/carts/${cartId}/products/${productId}`;
            
            try {
                const response = await fetch(url, {
                    method: 'POST'
                });

                if (response.ok) {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Error al agregar producto');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        });
        div.appendChild(addCartButton);
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("cart-button").addEventListener("click", async () => {
        try {
            const response = await fetch("/api/carts/67ca2b7d13c9804b87109f34");
            if (!response.ok) throw new Error("Error al obtener el carrito");
            
            const cart = await response.json();
            const cartContainer = document.getElementById("cart-container");

            if (cartContainer) {
                cartContainer.innerHTML = cart.productList
                    .filter(item => item.product)
                    .map(item => `
                        <div>
                            <h3>${item.product.title}</h3>
                            <p>Cantidad: ${item.quantity}</p>
                            <p>Precio: $${item.product.price}</p>
                        </div>
                    `).join("");
                
                cartContainer.classList.toggle("hidden");
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    getProducts(currentPage);
});
