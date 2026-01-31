const API_URL = 'https://api.escuelajs.co/api/v1/products';

let products = [];
let currentData = [];
let currentPage = 1;
let itemsPerPage = 10;

async function getAllProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        currentData = [...products];
        renderTable(products);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {  
    const keyword = e.target.value.toLowerCase();
    currentData = products.filter(p => p.title.toLowerCase().includes(keyword));
    currentPage = 1;
    renderTable(currentData);
});

function renderTable(data) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const pageData = currentData.slice(startIndex, endIndex);

    pageData.forEach(product => {
        let imgUrl = 'https://via.placeholder.com/100';
        if (product.images.length > 0) {
            imgUrl = product.images[0].replace(/[\[\]"]/g, ''); 
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${imgUrl}" class="product-img" onerror="this.src='https://via.placeholder.com/100'"></td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
        `;
        tableBody.appendChild(row);
    });
    updatePaginationUI();
}

function updatePaginationUI() {
    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    document.getElementById('page-info').innerText = `Page ${currentPage} / ${totalPages}`;
    
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(step) {
    currentPage += step;
    renderTable(currentData);
}

document.getElementById('items-per-page').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset về trang 1
    renderTable(currentData);
});

getAllProducts();