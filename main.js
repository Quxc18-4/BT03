const API_URL = 'https://api.escuelajs.co/api/v1/products';

let products = [];

async function getAllProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        renderTable(products);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''; 

    data.forEach(product => {
        const imgUrl = (product.images && product.images.length > 0) 
            ? product.images[0].replace('["', '').replace('"]', '')
            : 'https://via.placeholder.com/100';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${imgUrl}" alt="${product.title}" class="product-img" onerror="this.src='https://via.placeholder.com/100'"></td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

getAllProducts();