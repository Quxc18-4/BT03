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

function getCleanImageUrl(imgInput) {
    if (!imgInput) return 'https://via.placeholder.com/100?text=No+Image';

    let url = Array.isArray(imgInput) ? imgInput[0] : imgInput;

    if (typeof url === 'string') {
        url = url.replace(/[\[\]"]/g, '');
        
        if (!url.startsWith('http')) {
             return 'https://via.placeholder.com/100?text=Invalid+URL';
        }
    }
    return url;
}

function renderTable(data) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = ''; 

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const pageData = currentData.slice(startIndex, endIndex);

    pageData.forEach(product => {
        const imgUrl = getCleanImageUrl(product.images);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <img 
                    src="${imgUrl}" 
                    class="product-img" 
                    alt="${product.title}"
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/100?text=Error';"
                >
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

function handleSort(key, order) {
    currentData.sort((a, b) => {
        if (key === 'price') {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (key === 'title') {
            return order === 'asc' 
                ? a.title.localeCompare(b.title) 
                : b.title.localeCompare(a.title);
        }
    });
    renderTable(currentData);
}

getAllProducts();