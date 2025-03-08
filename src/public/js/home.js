import { api } from '../constants/environments.js'
const { apiUrl, productsEndpoint, logoImage } = api;

let currentPage = 1;
const limit = 6;
let currentSort = "";

async function getProducts(page, sort = "") {
    try {
        let url = `${apiUrl + productsEndpoint}?page=${page}&limit=${limit}`;
        if (sort) {
            url += `&sort=${sort}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        renderProducts(data.payload);

        document.getElementById("pageInfo").textContent = `Página ${data.page} de ${data.totalPages}`;
        document.getElementById("prevPage").disabled = !data.hasPrevPage;
        document.getElementById("nextPage").disabled = !data.hasNextPage;
        document.getElementById("prevPage").onclick = () => getProducts(data.prevPage, currentSort);
        document.getElementById("nextPage").onclick = () => getProducts(data.nextPage, currentSort);
        currentPage = data.page;
    } catch (e) {
        console.error("Error al cargar productos:", e);
    }
}

document.getElementById("sort-select").addEventListener("change", (event) => {
    currentSort = event.target.value;
    getProducts(1, currentSort);
});

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
                    Toastify({
                        text: "Producto agregado al carrito",
                        gravity: "bottom",
                        duration: 1500
                        }).showToast();
                } else {
                    Toastify({
                        text: "error al agregar el producto al carrito",
                        gravity: "bottom",
                        duration: 1500
                        }).showToast();
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
            await loadCart();
        });
        div.appendChild(addCartButton);
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("cart-button").addEventListener("click", async () => {
        cartContainer.classList.toggle("hidden");
        await loadCart();
    });
});

async function loadCart() {
    try {
        const response = await fetch("/api/carts/67ca2b7d13c9804b87109f34");
        if (!response.ok) throw new Error("Error al obtener el carrito");
        
        const cart = await response.json();
        const cartContainer = document.getElementById("cart-container");
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        
        if (cartContainer) {
            cartItems.innerHTML = "";
            let total = 0;
            
            cart.productList.filter(item => item.product).forEach(item => {
                total += item.quantity * item.product.price;
                
                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
                <h3>${item.product.title}</h3>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: $${item.product.price}</p>
                    <button class="decrease-quantity" data-id="${item.product._id}">-</button>
                    `;
                    cartItems.appendChild(div);
                });
                
                cartTotal.textContent = total;
                cartContainer.classList.toggle("hidden");
                document.querySelectorAll(".decrease-quantity").forEach(button => {
                    button.addEventListener("click", async (event) => {
                        const productId = event.target.dataset.id;
                        await decreaseProductQuantity(productId);
                        await loadCart();
                    });
                });
                document.getElementById("clear-cart").addEventListener("click", async () => {
                    await clearCart();
                });
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        }
}


async function decreaseProductQuantity(productId) {
    try {
        const response = await fetch(`/api/carts/67ca2b7d13c9804b87109f34/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'decrease' })
        });
        
        if (!response.ok) throw new Error("Error al reducir la cantidad del producto");
        
        await loadCart();
    } catch (error) {
        console.error("Error al reducir cantidad:", error);
    }
}

async function clearCart() {
    try {
        const response = await fetch(`/api/carts/67ca2b7d13c9804b87109f34`, {
            method: "DELETE"
        });
        
        if (!response.ok) throw new Error("Error al vaciar el carrito");

        await loadCart();
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    getProducts(currentPage);
    loadCart();
});
