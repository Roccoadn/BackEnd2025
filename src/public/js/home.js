const socketClient = io();

const addProduct = document.querySelector('#addProduct');
const deleteProduct = document.querySelector('#deleteProductById');
const productManager = {
    title: document.querySelector('#productTitle'),
    description: document.querySelector('#description'),
    price: document.querySelector('#price'),
    productId: document.querySelector('#id')
};

addProduct.addEventListener('click', () => {
    const title = productManager.title.value;
    const description = productManager.description.value;
    const price = productManager.price.value;

    socketClient.emit('newProduct', { title, description, price });
    console.log('Producto enviado al servidor');
});

deleteProduct.addEventListener('click', async () => {
    const productId = productManager.productId.value;

    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'DELETE',
        });
        if (response) {
            console.log('Producto eliminado con éxito');
        } else {
            console.log('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
