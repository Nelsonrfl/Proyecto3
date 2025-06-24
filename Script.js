document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const loginScreen = document.getElementById('loginScreen');
    const customerScreen = document.getElementById('customerScreen');
    const adminScreen = document.getElementById('adminScreen'); // Esta pantalla se ocultará
    const cartScreen = document.getElementById('cartScreen');
    const invoiceScreen = document.getElementById('invoiceScreen');
    const ordersScreen = document.getElementById('ordersScreen');
    const inventoryScreen = document.getElementById('inventoryScreen');

    const mainNav = document.getElementById('mainNav');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userNameSpan = document.getElementById('userName');

    const customerScreenTitle = document.getElementById('customerScreenTitle');
    const productList = document.getElementById('productList');
    const productSearchInput = document.getElementById('productSearch');
    const cartIcon = document.getElementById('cartIcon');
    const cartCountSpan = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSubtotalSpan = document.getElementById('cartSubtotal');
    const cartIVASpan = document.getElementById('cartIVA'); // Corregido: antes tenía 'document = document'
    const cartTotalSpan = document.getElementById('cartTotal');
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');

    const invoiceOrderIdSpan = document.getElementById('invoiceOrderId');
    const invoiceCustomerNameSpan = document.getElementById('invoiceCustomerName');
    const invoiceDateSpan = document.getElementById('invoiceDate');
    const invoiceItemsList = document.getElementById('invoiceItemsList');
    const invoiceSubtotalSpan = document.getElementById('invoiceSubtotal');
    const invoiceIVASpan = document.getElementById('invoiceIVA');
    const invoiceTotalSpan = document.getElementById('invoiceTotal');
    const newOrderBtn = document.getElementById('newOrderBtn');

    const ordersScreenTitle = document.getElementById('ordersScreenTitle');
    const ordersList = document.getElementById('ordersList');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    const customerOrdersActions = document.getElementById('customerOrdersActions');
    const goToNewOrderBtn = document.getElementById('goToNewOrderBtn');
    const logoutFromOrdersBtn = document.getElementById('logoutFromOrdersBtn');

    const addNewProductBtn = document.getElementById('addNewProductBtn');
    const inventoryProductList = document.getElementById('inventoryProductList');
    const noInventoryMessage = document.getElementById('noInventoryMessage');
    const productFormContainer = document.getElementById('productFormContainer');
    const productForm = document.getElementById('productForm');
    const formTitle = document.getElementById('formTitle');
    const productIdInput = document.getElementById('productId');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productStockInput = document.getElementById('productStock');
    const productImageUrlInput = document.getElementById('productImageUrl');
    const cancelProductFormBtn = document.getElementById('cancelProductFormBtn');

    const messageBox = document.getElementById('messageBox');

    // --- Datos simulados (para la demo) ---
    const IVA_RATE = 0.15; // 15% para Ecuador

    // Cargar productos desde localStorage o usar datos por defecto
    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 'prod001', name: 'Rollos de Plástico Film Estirable', description: 'Film estirable de alta resistencia para embalaje.', price: 15.50, stock: 100, imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=Film' },
        { id: 'prod002', name: 'Bolsas Plásticas Biodegradables', description: 'Bolsas ecológicas de diferentes tamaños.', price: 0.25, stock: 5000, imageUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=Bolsas' },
        { id: 'prod003', name: 'Contenedores Plásticos Herméticos (Pack)', description: 'Juego de 5 contenedores para alimentos.', price: 25.00, stock: 50, imageUrl: 'https://via.placeholder.com/150/FFC107/FFFFFF?text=Contenedores' },
        { id: 'prod004', name: 'Tubería PVC de 1/2 pulgada (metro)', description: 'Tubería de PVC para instalaciones hidráulicas.', price: 3.20, stock: 200, imageUrl: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=Tuber%C3%ADa' },
        { id: 'prod005', name: 'Mantel Plástico Desechable (Rollo)', description: 'Rollo de mantel plástico para eventos.', price: 8.75, stock: 120, imageUrl: 'https://via.placeholder.com/150/795548/FFFFFF?text=Mantel' }
    ];
    // Guardar productos iniciales si no existen
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Datos de órdenes simuladas (para la POC del admin)
    let orders = JSON.parse(localStorage.getItem('orders')) || []; // Persistencia básica para órdenes

    // Carga el carrito desde localStorage o inicializa un array vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Carga el usuario actual desde localStorage o inicializa a null
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // --- Funciones de Utilidad ---

    /**
     * Muestra un mensaje temporal en la parte inferior de la pantalla.
     * @param {string} message - El texto del mensaje a mostrar.
     * @param {string} type - El tipo de mensaje ('success' o 'error') para aplicar estilos.
     */
    function showMessage(message, type = 'success') {
        messageBox.textContent = message;
        messageBox.className = 'message-box show'; // Resetea clases y muestra
        if (type === 'error') {
            messageBox.style.backgroundColor = 'var(--error-color)';
        } else {
            messageBox.style.backgroundColor = 'var(--primary-color)';
        }
        // Oculta el mensaje después de 3 segundos
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000);
    }

    /**
     * Cambia la pantalla activa en la aplicación.
     * @param {string} screenId - El ID de la sección (pantalla) a mostrar.
     */
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active'); // Oculta todas las pantallas
        });
        document.getElementById(screenId).classList.add('active'); // Muestra la pantalla deseada
        
        // Oculta el formulario de producto al cambiar de pantalla
        productFormContainer.style.display = 'none';

        // Oculta las acciones de Mis Órdenes por defecto
        customerOrdersActions.style.display = 'none';

        // Ocultar la pantalla de admin genérica, ya que ahora se redirige a órdenes/inventario
        if (screenId !== 'adminScreen') {
             adminScreen.style.display = 'none';
        }

        // Actualiza la clase 'active' en el menú de navegación
        document.querySelectorAll('#mainNav a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.screen === screenId) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Actualiza el contador de ítems en el icono del carrito.
     */
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    /**
     * Formatea un número como precio con dos decimales.
     * @param {number} price - El número a formatear.
     * @returns {string} El precio formateado.
     */
    function formatPrice(price) {
        return price.toFixed(2);
    }

    // --- Renderizado de Productos (para Cliente) ---
    /**
     * Renderiza la lista de productos en la pantalla del cliente.
     * Permite filtrar los productos mostrados.
     * @param {Array} filteredProducts - Array de productos a renderizar (por defecto, ningún producto si no hay búsqueda).
     */
    function renderProducts(filteredProducts = []) {
        productList.innerHTML = ''; // Limpia la lista existente
        if (filteredProducts.length === 0 && productSearchInput.value === '') { // Muestra mensaje solo si no hay búsqueda activa
            productList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Ingrese un término de búsqueda para ver productos.</p>';
            return;
        } else if (filteredProducts.length === 0 && productSearchInput.value !== '') { // Mensaje si no hay resultados para la búsqueda
            productList.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No se encontraron productos para "${productSearchInput.value}".</p>`;
            return;
        }

        // Crea una tarjeta para cada producto
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150x120/cccccc/000000?text=No+Img';">` : `<img src="https://via.placeholder.com/150x120/cccccc/000000?text=No+Img" alt="No Image">`}
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${formatPrice(product.price)}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <div class="add-to-cart">
                    <input type="number" value="1" min="1" max="${product.stock}" data-product-id="${product.id}">
                    <button class="btn-primary add-btn" data-product-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            productList.appendChild(productCard);
        });

        // Añade event listeners a los botones "Agregar al Carrito"
        document.querySelectorAll('.add-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const quantityInput = e.target.previousElementSibling;
                const quantity = parseInt(quantityInput.value);
                addProductToCart(productId, quantity);
            });
        });
    }

    // --- Funcionalidades del Carrito ---
    /**
     * Agrega un producto al carrito o actualiza su cantidad si ya existe.
     * @param {string} productId - El ID del producto a agregar.
     * @param {number} quantity - La cantidad del producto a agregar.
     */
    function addProductToCart(productId, quantity) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            showMessage('Producto no encontrado.', 'error');
            return;
        }
        if (quantity <= 0 || isNaN(quantity) || quantity > product.stock) {
            showMessage(`Cantidad inválida o excede el stock disponible: ${product.stock}.`, 'error');
            return;
        }

        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            // Actualizar cantidad si ya existe, verificando que no exceda el stock
            if (cart[existingItemIndex].quantity + quantity > product.stock) {
                showMessage(`No hay suficiente stock para agregar ${quantity} unidades más de ${product.name}. Stock actual en carrito: ${cart[existingItemIndex].quantity}.`, 'error');
                return;
            }
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Añadir nuevo producto al carrito
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Guarda el carrito en localStorage
        updateCartCount(); // Actualiza el contador del carrito en la cabecera
        renderCartItems(); // Vuelve a renderizar los ítems en la pantalla del carrito
        showMessage(`"${product.name}" agregado al carrito correctamente.`);
    }

    /**
     * Elimina un producto del carrito.
     * @param {string} productId - El ID del producto a eliminar.
     */
    function removeProductFromCart(productId) {
        cart = cart.filter(item => item.id !== productId); // Filtra el array, eliminando el producto
        localStorage.setItem('cart', JSON.stringify(cart)); // Actualiza localStorage
        updateCartCount(); // Actualiza contador
        renderCartItems(); // Vuelve a renderizar
        showMessage('Producto eliminado del carrito.');
    }

    /**
     * Renderiza los ítems actuales del carrito en la pantalla del carrito.
     * Calcula y muestra el subtotal, IVA y total.
     */
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Limpia el contenido actual del carrito
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block'; // Muestra mensaje de carrito vacío
            confirmOrderBtn.disabled = true; // Deshabilita el botón de confirmar
        } else {
            emptyCartMessage.style.display = 'none'; // Oculta mensaje de carrito vacío
            confirmOrderBtn.disabled = false; // Habilita el botón de confirmar
            let subtotal = 0;
            // Itera sobre los ítems del carrito para mostrarlos y calcular el subtotal
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.quantity} x $${formatPrice(item.price)} = $${formatPrice(itemTotal)}</p>
                    </div>
                    <button class="remove-from-cart btn-danger" data-product-id="${item.id}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            // Añade event listeners a los botones "Eliminar" del carrito
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    removeProductFromCart(e.target.dataset.productId);
                });
            });

            const iva = subtotal * IVA_RATE;
            const total = subtotal + iva;
            // Actualiza los valores de resumen del carrito
            cartSubtotalSpan.textContent = formatPrice(subtotal);
            cartIVASpan.textContent = formatPrice(iva);
            cartTotalSpan.textContent = formatPrice(total);
        }
    }

    // --- Flujo de Pedido y Factura ---
    /**
     * Procesa la confirmación de un pedido, genera una factura simulada
     * y simula la actualización de stock.
     */
    function confirmOrder() {
        if (cart.length === 0) {
            showMessage('El carrito está vacío. Agregue productos antes de confirmar.', 'error');
            return;
        }

        // Simular generación de ID de pedido y datos del cliente/fecha
        const orderId = `ORD-${Date.now()}`; // ID de pedido único basado en el timestamp
        const customerName = currentUser.email.split('@')[0].toUpperCase(); // Nombre del cliente simulado
        const orderDate = new Date().toLocaleDateString('es-EC'); // Fecha actual

        let subtotal = 0;
        const orderItemsForInvoice = []; // Para guardar en la orden simulada
        invoiceItemsList.innerHTML = ''; // Limpia la lista de ítems en la factura
        // Itera sobre el carrito para construir el detalle de la factura
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (${item.quantity} x $${formatPrice(item.price)})</span>
                <span>$${formatPrice(itemTotal)}</span>
            `;
            invoiceItemsList.appendChild(listItem);
            orderItemsForInvoice.push({ ...item }); // Copia el ítem para la orden
        });

        const iva = subtotal * IVA_RATE;
        const total = subtotal + iva;

        // Rellena los detalles de la factura en el HTML
        invoiceOrderIdSpan.textContent = orderId;
        invoiceCustomerNameSpan.textContent = customerName;
        invoiceDateSpan.textContent = orderDate;
        invoiceSubtotalSpan.textContent = formatPrice(subtotal);
        invoiceIVASpan.textContent = formatPrice(iva);
        invoiceTotalSpan.textContent = formatPrice(total);

        // Simular descuento de stock de los productos vendidos
        // Actualiza el array 'products' y lo guarda en localStorage.
        cart.forEach(cartItem => {
            const productIndex = products.findIndex(p => p.id === cartItem.id);
            if (productIndex !== -1) {
                products[productIndex].stock -= cartItem.quantity;
                if (products[productIndex].stock < 0) products[productIndex].stock = 0; // Evitar stock negativo
            }
        });
        localStorage.setItem('products', JSON.stringify(products)); // Guarda el stock actualizado


        // Guardar la orden simulada (para que el admin pueda consultarla)
        orders.push({
            orderId: orderId,
            customerEmail: currentUser.email,
            customerName: customerName,
            date: orderDate,
            items: orderItemsForInvoice,
            subtotal: subtotal,
            iva: iva,
            total: total,
            status: 'Pendiente de Pago', // Estado inicial
            paid: false
        });
        localStorage.setItem('orders', JSON.stringify(orders)); // Persistir órdenes

        // Limpiar carrito después de confirmar el pedido
        cart = [];
        localStorage.removeItem('cart'); // Elimina el carrito de localStorage
        updateCartCount(); // Actualiza el contador a 0

        showMessage('El pedido ha sido confirmado y se genera la Factura Respectiva.', 'success');
        switchScreen('invoiceScreen'); // Cambia a la pantalla de factura
        // Simular envío de email al administrador
        console.log(`[SIMULACIÓN] Email enviado al administrador: Nuevo pedido #${orderId} de ${customerName}.`);
    }

    // --- Módulo de Órdenes (Compartido) ---
    /**
     * Renderiza la lista de órdenes en formato de tabla.
     * @param {boolean} isAdminView - True si es la vista del administrador, false para cliente.
     */
    function renderOrders(isAdminView = false) {
        ordersList.innerHTML = '';
        noOrdersMessage.style.display = 'none'; // Oculta el mensaje de "no hay órdenes"

        let ordersToDisplay = orders;
        if (!isAdminView && currentUser) {
            ordersToDisplay = orders.filter(order => order.customerEmail === currentUser.email);
            ordersScreenTitle.textContent = 'Mis Órdenes de Compra';
            customerOrdersActions.style.display = 'flex'; // Mostrar acciones para cliente
        } else {
            ordersScreenTitle.textContent = 'Gestión de Órdenes de Compra';
            customerOrdersActions.style.display = 'none'; // Ocultar acciones para admin
        }

        if (ordersToDisplay.length === 0) {
            noOrdersMessage.style.display = 'block';
            ordersList.innerHTML = ''; // Asegura que esté vacío
            return;
        }

        // Crear la tabla
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Detalle</th>
                    ${isAdminView ? '<th>Acciones</th>' : ''}
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        ordersToDisplay.forEach(order => {
            const row = tbody.insertRow();
            row.insertCell().textContent = order.orderId;
            row.insertCell().textContent = order.customerName;
            row.insertCell().textContent = order.date;
            row.insertCell().textContent = `$${formatPrice(order.total)}`;

            const statusCell = row.insertCell();
            statusCell.textContent = order.status;
            statusCell.style.color = order.paid ? 'green' : 'orange';
            statusCell.style.fontWeight = 'bold';


            const detailCell = row.insertCell();
            const itemsHtml = order.items.map(item => `
                <li>${item.name} (${item.quantity} x $${formatPrice(item.price)})</li>
            `).join('');
            detailCell.innerHTML = `<ul class="order-items-list">${itemsHtml}</ul>`;

            if (isAdminView) {
                const actionsCell = row.insertCell();
                if (!order.paid) { // Solo mostrar botón si no está pagado
                    const markPaidBtn = document.createElement('button');
                    markPaidBtn.className = 'btn-primary';
                    markPaidBtn.textContent = 'Marcar Pagado';
                    markPaidBtn.dataset.orderId = order.orderId;
                    markPaidBtn.dataset.action = 'mark-paid';
                    actionsCell.appendChild(markPaidBtn);
                } else {
                    actionsCell.textContent = 'N/A';
                }
            }
        });

        ordersList.appendChild(table);

        if (isAdminView) {
            document.querySelectorAll('[data-action="mark-paid"]').forEach(button => {
                button.addEventListener('click', (e) => {
                    const orderId = e.target.dataset.orderId;
                    const orderIndex = orders.findIndex(o => o.orderId === orderId);
                    if (orderIndex > -1) {
                        orders[orderIndex].status = 'Pagado / Entregado';
                        orders[orderIndex].paid = true;
                        localStorage.setItem('orders', JSON.stringify(orders));
                        showMessage(`Orden #${orderId} marcada como pagada.`, 'success');
                        renderOrders(true); // Re-renderizar la lista de órdenes de admin
                    }
                });
            });
        }
    }

    // --- Módulo de Administración de Inventario (Solo Admin) ---
    /**
     * Renderiza la lista de productos en formato de tabla para el administrador.
     */
    function renderInventoryProducts() {
        inventoryProductList.innerHTML = '';
        noInventoryMessage.style.display = 'none';
        // productFormContainer.style.display = 'none'; // Ahora se oculta por defecto en switchScreen

        if (products.length === 0) {
            noInventoryMessage.style.display = 'block';
            return;
        }

        // Crear la tabla
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        products.forEach(product => {
            const row = tbody.insertRow();
            row.insertCell().innerHTML = product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/70x70/cccccc/000000?text=No+Img';">` : 'N/A';
            row.insertCell().textContent = product.id;
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.description;
            row.insertCell().textContent = `$${formatPrice(product.price)}`;
            row.insertCell().textContent = product.stock;

            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-secondary edit-product';
            editBtn.textContent = 'Editar';
            editBtn.dataset.productId = product.id;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-danger delete-product';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.dataset.productId = product.id;

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });

        inventoryProductList.appendChild(table);

        document.querySelectorAll('.edit-product').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                editProduct(productId);
            });
        });

        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                deleteProduct(productId);
            });
        });
    }

    /**
     * Prepara el formulario para añadir un nuevo producto.
     */
    function showAddProductForm() {
        formTitle.textContent = 'Añadir';
        productForm.reset(); // Limpia el formulario
        productIdInput.value = ''; // Asegura que no haya ID para nuevo producto
        productFormContainer.style.display = 'block';
        // Desplazarse al formulario para que sea visible
        productFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Prepara el formulario para editar un producto existente.
     * @param {string} productId - El ID del producto a editar.
     */
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            formTitle.textContent = 'Editar';
            productIdInput.value = product.id;
            productNameInput.value = product.name;
            productDescriptionInput.value = product.description;
            productPriceInput.value = product.price;
            productStockInput.value = product.stock;
            productImageUrlInput.value = product.imageUrl || '';
            productFormContainer.style.display = 'block';
            // Desplazarse al formulario para que sea visible
            productFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            showMessage('Producto no encontrado para editar.', 'error');
        }
    }

    /**
     * Guarda un producto (nuevo o editado) en el inventario.
     * @param {Event} e - El evento de submit del formulario.
     */
    function saveProduct(e) {
        e.preventDefault();

        const id = productIdInput.value;
        const name = productNameInput.value;
        const description = productDescriptionInput.value;
        const price = parseFloat(productPriceInput.value);
        const stock = parseInt(productStockInput.value);
        const imageUrl = productImageUrlInput.value;

        if (!name || !description || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
            showMessage('Por favor, rellena todos los campos correctamente. Precio y Stock deben ser números no negativos.', 'error');
            return;
        }

        if (id) {
            // Editar producto existente
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex > -1) {
                products[productIndex] = { ...products[productIndex], name, description, price, stock, imageUrl };
                showMessage('Producto actualizado correctamente.', 'success');
            } else {
                showMessage('Producto no encontrado para actualizar.', 'error');
            }
        } else {
            // Añadir nuevo producto
            const newId = `prod${Date.now()}`;
            products.push({ id: newId, name, description, price, stock, imageUrl });
            showMessage('Producto añadido correctamente.', 'success');
        }
        localStorage.setItem('products', JSON.stringify(products)); // Guarda el array products en localStorage
        renderInventoryProducts(); // Re-renderiza la lista de inventario
        productFormContainer.style.display = 'none'; // Oculta el formulario
    }

    /**
     * Elimina un producto del inventario.
     * @param {string} productId - El ID del producto a eliminar.
     */
    function deleteProduct(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            products = products.filter(p => p.id !== productId);
            showMessage('Producto eliminado correctamente.', 'success');
            localStorage.setItem('products', JSON.stringify(products)); // Guarda el array products en localStorage
            renderInventoryProducts();
        }
    }

    // --- Autenticación y UI por Rol ---
    /**
     * Simula el proceso de login.
     * @param {string} email - El email del usuario.
     * @param {string} password - La contraseña del usuario.
     */
    function login(email, password) {
        // Credenciales de demostración
        if (email === 'cliente@ejemplo.com' && password === '123456') {
            currentUser = { email: email, role: 'customer', name: 'Cliente Ejemplo' };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Inicio de sesión como cliente exitoso.');
            setupAppForUser(); // Configura la UI para el cliente
            emailInput.value = ''; // Blanquear campos después del login
            passwordInput.value = '';
        } else if (email === 'admin@ejemplo.com' && password === '123456') {
            currentUser = { email: email, role: 'admin', name: 'Administrador' };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Inicio de sesión como administrador exitoso.');
            setupAppForUser(); // Configura la UI para el administrador
            emailInput.value = ''; // Blanquear campos después del login
            passwordInput.value = '';
        } else {
            showMessage('Credenciales incorrectas.', 'error');
            currentUser = null; // Reinicia el usuario actual
        }
    }

    /**
     * Cierra la sesión del usuario actual.
     */
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser'); // Elimina usuario de localStorage
        localStorage.removeItem('cart'); // Limpia el carrito al cerrar sesión
        cart = []; // Reinicia el carrito en memoria
        updateCartCount(); // Actualiza el contador del carrito
        showMessage('Sesión cerrada.');
        showLoginScreen(); // Vuelve a la pantalla de login
        renderMainMenu(); // Renderiza el menú vacío
        emailInput.value = ''; // Blanquear campos
        passwordInput.value = '';
    }

    /**
     * Muestra la pantalla de inicio de sesión y oculta elementos específicos de usuario.
     */
    function showLoginScreen() {
        switchScreen('loginScreen');
        userInfo.style.display = 'none'; // Oculta la información del usuario
        cartIcon.style.display = 'none'; // Oculta el icono del carrito
        emailInput.value = ''; // Limpia campos del formulario
        passwordInput.value = '';
        productFormContainer.style.display = 'none'; // Asegura que el formulario de producto esté oculto
    }

    /**
     * Renderiza el menú de navegación según el rol del usuario.
     */
    function renderMainMenu() {
        mainNav.innerHTML = ''; // Limpia el menú existente
        if (currentUser) {
            if (currentUser.role === 'customer') {
                const navItems = `
                    <a href="#" data-screen="customerScreen">Hacer Pedido</a>
                    <a href="#" data-screen="ordersScreen">Mis Órdenes</a>
                `;
                mainNav.innerHTML = navItems;
            } else if (currentUser.role === 'admin') {
                const navItems = `
                    <a href="#" data-screen="ordersScreen">Órdenes de Compra</a>
                    <a href="#" data-screen="inventoryScreen">Administrar Inventario</a>
                `;
                mainNav.innerHTML = navItems;
            }
            // Añadir event listeners a los nuevos enlaces del menú
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetScreen = e.target.dataset.screen;
                    if (targetScreen === 'ordersScreen') {
                        renderOrders(currentUser.role === 'admin'); // Pasa true si es admin
                    } else if (targetScreen === 'inventoryScreen') {
                        renderInventoryProducts();
                    } else if (targetScreen === 'customerScreen') {
                        // Al volver al catálogo, limpiar búsqueda si no hay texto
                        if (productSearchInput.value === '') {
                             renderProducts([]); // Mostrar mensaje de búsqueda
                        } else {
                            // Si hay texto en la búsqueda, mantener la búsqueda
                            const searchTerm = productSearchInput.value.toLowerCase();
                            const filteredProducts = products.filter(p =>
                                p.name.toLowerCase().includes(searchTerm) ||
                                p.description.toLowerCase().includes(searchTerm)
                            );
                            renderProducts(filteredProducts);
                        }
                    }
                    switchScreen(targetScreen);
                });
            });
        }
    }

    /**
     * Configura la interfaz de la aplicación según el rol del usuario logueado.
     */
    function setupAppForUser() {
        renderMainMenu(); // Siempre renderiza el menú primero
        if (currentUser) {
            userNameSpan.textContent = `Hola, ${currentUser.name}`; // Muestra nombre de usuario
            userInfo.style.display = 'flex'; // Muestra info de usuario
            
            if (currentUser.role === 'customer') {
                cartIcon.style.display = 'flex'; // Muestra icono del carrito para clientes
                customerScreenTitle.textContent = 'Datos del Pedido'; // Actualiza el título
                productSearchInput.value = ''; // Limpia el input de búsqueda al cambiar de pantalla
                renderProducts([]); // No muestra productos por defecto, espera la búsqueda
                updateCartCount(); // Actualiza el contador del carrito
                switchScreen('customerScreen'); // Cambia a la pantalla del cliente
            } else if (currentUser.role === 'admin') {
                cartIcon.style.display = 'none'; // Oculta icono del carrito para admins
                // Al iniciar como admin, ir directamente a Órdenes de Compra
                renderOrders(true); // Carga las órdenes para el admin
                switchScreen('ordersScreen'); // Cambia a la pantalla de órdenes
            }
        } else {
            showLoginScreen(); // Si no hay usuario, muestra la pantalla de login
        }
    }

    // --- Event Listeners ---
    // Maneja el envío del formulario de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el recargado de la página
        login(emailInput.value, passwordInput.value);
    });

    // Maneja el click en el botón de logout
    logoutBtn.addEventListener('click', logout);

    // Maneja el click en el icono del carrito
    cartIcon.addEventListener('click', () => {
        if (currentUser && currentUser.role === 'customer') {
            renderCartItems(); // Renderiza los ítems del carrito
            switchScreen('cartScreen'); // Cambia a la pantalla del carrito
        } else {
            // Este caso no debería darse si el icono está oculto para admins,
            // pero es un buen fallback.
            showMessage('Necesitas iniciar sesión como cliente para ver el carrito.', 'error');
        }
    });

    // Maneja la búsqueda de productos
    productSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts); // Renderiza productos filtrados
    });

    // Maneja el click en el botón de confirmar pedido
    confirmOrderBtn.addEventListener('click', confirmOrder);

    // Nuevo: Maneja el click en el botón "Continuar Comprando" desde el carrito
    continueShoppingBtn.addEventListener('click', () => {
        switchScreen('customerScreen');
        // Mantener la búsqueda si existía, o mostrar el mensaje de búsqueda.
        const searchTerm = productSearchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredProducts = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        } else {
            renderProducts([]); // Mostrar mensaje de búsqueda si no hay nada escrito
        }
    });

    // Maneja el click en el botón de "Nuevo Pedido" después de la factura
    newOrderBtn.addEventListener('click', () => {
        if (currentUser && currentUser.role === 'customer') {
            productSearchInput.value = ''; // Limpia la búsqueda
            renderProducts([]); // Vuelve a cargar productos para un nuevo pedido (ocultos por defecto)
            switchScreen('customerScreen'); // Cambia a la pantalla del cliente
        } else {
            // Si el usuario no es cliente o no está logueado, lo envía al login
            showLoginScreen();
        }
    });

    // Nuevos Event listeners para la pantalla "Mis Órdenes" (cliente)
    goToNewOrderBtn.addEventListener('click', () => {
        if (currentUser && currentUser.role === 'customer') {
            productSearchInput.value = '';
            renderProducts([]);
            switchScreen('customerScreen');
        }
    });

    logoutFromOrdersBtn.addEventListener('click', logout);

    // Event listeners para Admin (Inventario)
    addNewProductBtn.addEventListener('click', showAddProductForm);
    cancelProductFormBtn.addEventListener('click', () => { productFormContainer.style.display = 'none'; });
    productForm.addEventListener('submit', saveProduct);

    // --- Inicialización ---
    // Si no hay un usuario logueado en localStorage, muestra la pantalla de login por defecto.
    // Si hay un usuario, configura la app para ese usuario.
    if (!currentUser) {
        showLoginScreen();
    } else {
        setupAppForUser();
    }
});
style.css
/* Variables CSS */
:root {
    --primary-color: #007bff; /* Azul vibrante */
    --secondary-color: #6c757d; /* Gris oscuro */
    --accent-color: #28a745; /* Verde para éxito/confirmación */
    --danger-color: #dc3545; /* Rojo para errores/eliminar */
    --warning-color: #ffc107; /* Amarillo para advertencias */
    --info-color: #17a2b8; /* Azul claro para información */
    --background-light: #f8f9fa; /* Fondo claro */
    --text-color: #343a40; /* Texto oscuro */
    --border-color: #dee2e6; /* Borde gris claro */
    --header-bg: #343a40; /* Fondo del header */
    --header-text: #ffffff; /* Texto del header */
    --card-bg: #ffffff; /* Fondo de tarjetas */
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    --border-radius: 8px;
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Base global */
body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
    background-color: var(--background-light);
    color: var(--text-color);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Header */
header {
    background-color: var(--header-bg);
    color: var(--header-text);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--box-shadow);
    flex-wrap: wrap; /* Permite que los elementos se envuelvan en pantallas pequeñas */
}

header .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

header .logo img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    object-fit: cover;
}

header h1 {
    margin: 0;
    font-size: 1.8rem;
}

/* Navegación Principal (Menú) */
nav#mainNav {
    display: flex;
    gap: 1.5rem;
}

nav#mainNav a {
    color: var(--header-text);
    text-decoration: none;
    font-weight: bold;
    padding: 0.5rem 0.8rem;
    border-radius: var(--border-radius);
    transition: background-color 0.3s ease;
}

nav#mainNav a:hover,
nav#mainNav a.active {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Estilos para el menú de hamburguesa */
.menu-toggle {
    display: none; /* Oculto por defecto en pantallas grandes */
    background: none;
    border: none;
    color: var(--header-text);
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-left: auto; /* Empuja el botón a la derecha */
}

/* Ocultar la navegación en móviles por defecto */
@media (max-width: 768px) {
    nav#mainNav {
        display: none; /* Oculta la navegación por defecto en móviles */
        flex-direction: column;
        width: 100%; /* Ocupa todo el ancho */
        background-color: var(--header-bg); /* Mismo fondo que el header */
        position: absolute;
        top: 70px; /* Ajustar según la altura de tu header */
        left: 0;
        box-shadow: var(--box-shadow);
        padding: 1rem 0;
        z-index: 1000; /* Asegura que esté por encima de otros contenidos */
    }

    nav#mainNav.active {
        display: flex; /* Muestra la navegación cuando tiene la clase 'active' */
    }

    nav#mainNav a {
        padding: 1rem 2rem; /* Más padding para los elementos del menú en móvil */
        width: 100%;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Separador entre ítems */
    }

    nav#mainNav a:last-child {
        border-bottom: none;
    }

    .menu-toggle {
        display: block; /* Muestra el botón de hamburguesa en móviles */
    }

    header .header-right {
        width: 100%; /* Asegura que los elementos de la derecha se alineen bien */
        display: flex;
        justify-content: flex-end; /* Alinea a la derecha */
        margin-top: 1rem; /* Espacio entre el logo/hamburguesa y la info de usuario */
    }

    header {
        flex-wrap: nowrap; /* Desactiva el wrap para el layout principal del header en móvil */
        align-items: flex-start; /* Alinea los ítems arriba */
        padding-bottom: 0;
    }
}


/* Elementos de la derecha del header */
.header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.1rem;
    font-weight: 500;
}

.cart-icon {
    font-size: 1.8rem;
    cursor: pointer;
    position: relative;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: background-color 0.3s ease;
}

.cart-icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--danger-color);
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

/* Contenido Principal */
main {
    flex-grow: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box; /* Incluir padding en el ancho total */
}

/* Pantallas (Secciones) */
.screen {
    display: none;
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: 2rem; /* Espacio entre pantallas si fueran visibles */
}

.screen.active {
    display: block; /* Solo la pantalla activa es visible */
}

.screen h2 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
}

/* Formularios genéricos */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: var(--text-color);
}

.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="url"],
.form-group textarea {
    width: calc(100% - 20px); /* Resta el padding */
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    box-sizing: border-box; /* Incluye padding en el ancho */
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

/* Botones genéricos */
.btn-primary,
.btn-secondary,
.btn-danger,
.btn-logout {
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: darken(var(--primary-color), 10%); /* Ajustar color más oscuro */
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: var(--secondary-color);
    color: white;
}

.btn-secondary:hover {
    background-color: darken(var(--secondary-color), 10%);
    transform: translateY(-2px);
}

.btn-danger {
    background-color: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background-color: darken(var(--danger-color), 10%);
    transform: translateY(-2px);
}

.btn-logout {
    background-color: transparent;
    color: var(--header-text);
    border: 1px solid var(--header-text);
    padding: 8px 15px;
}

.btn-logout:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Mensajes de feedback */
.message-box {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-color); /* Color por defecto */
    color: white;
    padding: 15px 25px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.message-box.show {
    opacity: 1;
    visibility: visible;
}

/* Estilos específicos para customerScreen (Product List) */
.search-bar {
    margin-bottom: 2rem;
    text-align: center;
}

.search-bar input {
    width: 80%;
    max-width: 500px;
    padding: 12px 15px;
    border: 1px solid var(--border-color);
    border-radius: 50px; /* Borde más redondeado para la barra de búsqueda */
    font-size: 1.1rem;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
    transition: border-color 0.3s ease;
}

.search-bar input:focus {
    border-color: var(--primary-color);
    outline: none;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    justify-content: center; /* Centra las tarjetas si no llenan la fila */
}

.product-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card img {
    max-width: 100%;
    height: 150px;
    object-fit: contain; /* Para que la imagen se ajuste sin recortarse */
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    background-color: #f0f0f0; /* Fondo para imágenes placeholder */
}

.product-card h3 {
    font-size: 1.4rem;
    margin: 0.8rem 0;
    color: var(--primary-color);
}

.product-card p {
    font-size: 0.95rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
    flex-grow: 1; /* Permite que la descripción ocupe espacio */
}

.product-card .price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--accent-color);
    margin-top: 1rem;
}

.product-card .stock {
    font-size: 0.9rem;
    color: var(--info-color);
    margin-bottom: 1rem;
}

.product-card .add-to-cart {
    display: flex;
    flex-direction: column; /* Apila input y botón */
    align-items: center;
    gap: 0.5rem;
    width: 100%; /* Asegura que ocupen el ancho de la tarjeta */
}

.product-card .add-to-cart input {
    width: 80px;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    text-align: center;
    font-size: 1rem;
}

.product-card .add-to-cart .add-btn {
    width: 100%;
    padding: 10px;
}

/* Estilos para cartScreen */
.cart-items-container {
    max-height: 400px; /* Altura máxima para scroll */
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px dashed var(--border-color);
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-info h4 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-color);
}

.cart-item-info p {
    margin: 0.2rem 0 0;
    font-size: 0.9rem;
    color: var(--secondary-color);
}

.empty-message {
    text-align: center;
    color: var(--secondary-color);
    margin-top: 2rem;
    font-style: italic;
}

.cart-summary {
    text-align: right;
    padding-top: 1rem;
    border-top: 2px solid var(--primary-color);
    margin-top: 1.5rem;
}

.cart-summary p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

.cart-summary h3 {
    margin-top: 1rem;
    font-size: 1.8rem;
    color: var(--accent-color);
}

.cart-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

/* Estilos para invoiceScreen */
.invoice-details {
    background-color: #e9ecef;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
}

.invoice-details p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

.invoice-items-list {
    list-style: none;
    padding: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
}

.invoice-items-list li {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    border-bottom: 1px dashed var(--border-color);
}

.invoice-items-list li:last-child {
    border-bottom: none;
}

.invoice-summary {
    text-align: right;
    padding-top: 1rem;
    border-top: 2px solid var(--primary-color);
}

.invoice-summary p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

.invoice-summary h3 {
    margin-top: 1rem;
    font-size: 1.8rem;
    color: var(--accent-color);
}

/* Estilos para ordersScreen (Tabla de Órdenes) */
.orders-list table,
.inventory-product-list table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
}

.orders-list th,
.inventory-product-list th,
.orders-list td,
.inventory-product-list td {
    border: 1px solid var(--border-color);
    padding: 12px 15px;
    text-align: left;
}

.orders-list th,
.inventory-product-list th {
    background-color: var(--primary-color);
    color: white;
    font-weight: bold;
}

.orders-list tr:nth-child(even),
.inventory-product-list tr:nth-child(even) {
    background-color: #f2f2f2;
}

.orders-list tr:hover,
.inventory-product-list tr:hover {
    background-color: #e9e9e9;
}

.order-status {
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.9rem;
}

.order-status.pendiente {
    background-color: var(--warning-color);
    color: #856404; /* Color de texto más oscuro para contraste */
}

.order-status.entregado {
    background-color: var(--accent-color);
    color: white;
}

.order-status.cancelado {
    background-color: var(--danger-color);
    color: white;
}

.order-items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
    color: var(--secondary-color);
}

.order-items-list li {
    margin-bottom: 3px;
}

.customer-orders-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

/* Estilos para inventoryScreen (Gestión de Productos) */
.add-new-product-btn {
    margin-bottom: 2rem;
}

.form-container {
    background-color: #e6f7ff; /* Un azul muy claro para el formulario de producto */
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: 2rem;
}

.form-container h3 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
}

.inventory-product-list img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: var(--border-radius);
    background-color: #f0f0f0;
}

.inventory-product-list td button {
    margin-right: 0.5rem;
    padding: 8px 12px;
    font-size: 0.85rem;
}

/* Media Queries para Responsividad General */
@media (max-width: 768px) {
    header {
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
    }

    header .logo {
        width: 100%;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .header-right {
        width: 100%;
        justify-content: center;
        gap: 1rem;
    }

    nav#mainNav {
        width: 100%;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    main {
        padding: 1rem;
    }

    .screen {
        padding: 1.5rem;
    }

    .screen h2 {
        font-size: 1.6rem;
    }

    .product-list {
        grid-template-columns: 1fr; /* Una columna en móviles */
    }

    .cart-actions,
    .customer-orders-actions,
    .form-actions {
        flex-direction: column;
        gap: 0.8rem;
    }

    .btn-primary, .btn-secondary, .btn-danger {
        width: 100%;
    }

    .orders-list th, .orders-list td,
    .inventory-product-list th, .inventory-product-list td {
        padding: 8px 10px;
        font-size: 0.9rem;
    }

    /* Ocultar descripción en tablas pequeñas para ahorrar espacio */
    .inventory-product-list td:nth-child(4) { /* Columna de descripción */
        display: none;
    }
    .inventory-product-list th:nth-child(4) {
        display: none;
    }

    .message-box {
        width: 90%;
        left: 5%;
        transform: translateX(0);
        bottom: 10px;
        font-size: 0.9rem;
        text-align: center;
    }
}

/* Utilities (Puedes usar estas clases para estados específicos) */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}
