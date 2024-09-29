const apiUrl = 'http://localhost:3000/products';
let currentPage = 1;
const itemsPerPage = 3;

document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();

    // Form Submission
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('productId').value;
        const product = {
            name: document.getElementById('productName').value,
            price: document.getElementById('productPrice').value,
            number: document.getElementById('productNumber').value,
            brand: document.getElementById('productBrand').value,
            color: document.getElementById('productColor').value
        };
        
        if (id) {
            // Edit Product
            fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            }).then(fetchProducts);
        } else {
            // Add Product
            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            }).then(fetchProducts);
        }

        document.getElementById('productForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEditModal'));
        modal.hide();
    });
});

function fetchProducts() {
    fetch(`${apiUrl}?_page=${currentPage}&_limit=${itemsPerPage}`)
        .then(response => response.json())
        .then(products => renderTable(products));

    fetch(apiUrl).then(response => response.json()).then(products => renderPagination(products));
}

function renderTable(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const idDisplay = (currentPage - 1) * itemsPerPage + index + 1; // T/R chiqishi
        const row = `
            <tr>
                <td>${idDisplay}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.number}</td>
                <td>${product.brand}</td>
                <td>${product.color}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination(products) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const pageCount = Math.ceil(products.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', () => {
            currentPage = i;
            fetchProducts();
        });
        pagination.appendChild(li);
    }
}

function editProduct(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productNumber').value = product.number;
            document.getElementById('productBrand').value = product.brand;
            document.getElementById('productColor').value = product.color;

            const modal = new bootstrap.Modal(document.getElementById('addEditModal'));
            modal.show();
        });
}

function deleteProduct(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(fetchProducts);
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}
