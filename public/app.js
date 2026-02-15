const API_URL = 'http://localhost:3000/api';

let currentEditId = null;
let allVehicles = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();
    loadBrands();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search on Enter key
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Filter changes
    const filterElements = ['tipoFilter', 'marcaFilter', 'anoMin', 'anoMax', 'precoMin', 'precoMax'];
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
}

// Load all vehicles
async function loadVehicles(filters = {}) {
    const vehiclesList = document.getElementById('vehiclesList');
    vehiclesList.innerHTML = '<div class="loading">Carregando veículos...</div>';

    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/vehicles?${queryParams}`);
        
        if (!response.ok) {
            throw new Error('Failed to load vehicles');
        }

        allVehicles = await response.json();
        displayVehicles(allVehicles);
    } catch (error) {
        console.error('Error loading vehicles:', error);
        vehiclesList.innerHTML = '<div class="no-results">Erro ao carregar veículos. Tente novamente.</div>';
    }
}

// Display vehicles
function displayVehicles(vehicles) {
    const vehiclesList = document.getElementById('vehiclesList');
    const resultsCount = document.getElementById('resultsCount');

    resultsCount.textContent = `${vehicles.length} veículo${vehicles.length !== 1 ? 's' : ''} encontrado${vehicles.length !== 1 ? 's' : ''}`;

    if (vehicles.length === 0) {
        vehiclesList.innerHTML = '<div class="no-results">Nenhum veículo encontrado com os filtros selecionados.</div>';
        return;
    }

    vehiclesList.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card" onclick="showVehicleDetail(${vehicle.id})">
            <img src="${vehicle.imagem || 'https://via.placeholder.com/400x300/cccccc/666666?text=Sem+Imagem'}" 
                 alt="${vehicle.marca} ${vehicle.modelo}" 
                 class="vehicle-image"
                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/666666?text=Sem+Imagem'">
            <div class="vehicle-info">
                <div class="vehicle-title">${vehicle.marca} ${vehicle.modelo}</div>
                <div class="vehicle-subtitle">${vehicle.tipo} • ${vehicle.ano}</div>
                <div class="vehicle-price">R$ ${formatPrice(vehicle.preco)}</div>
                <div class="vehicle-details">
                    <span class="vehicle-detail-item">📏 ${formatNumber(vehicle.quilometragem)} km</span>
                    ${vehicle.combustivel ? `<span class="vehicle-detail-item">⛽ ${vehicle.combustivel}</span>` : ''}
                    ${vehicle.cambio ? `<span class="vehicle-detail-item">⚙️ ${vehicle.cambio}</span>` : ''}
                </div>
                ${vehicle.cidade && vehicle.estado ? `<div class="vehicle-location">📍 ${vehicle.cidade} - ${vehicle.estado}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// Show vehicle detail
async function showVehicleDetail(id) {
    try {
        const response = await fetch(`${API_URL}/vehicles/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to load vehicle details');
        }

        const vehicle = await response.json();
        
        const detailHtml = `
            <img src="${vehicle.imagem || 'https://via.placeholder.com/800x500/cccccc/666666?text=Sem+Imagem'}" 
                 alt="${vehicle.marca} ${vehicle.modelo}" 
                 class="detail-image"
                 onerror="this.src='https://via.placeholder.com/800x500/cccccc/666666?text=Sem+Imagem'">
            
            <h2 class="detail-title">${vehicle.marca} ${vehicle.modelo}</h2>
            <div class="vehicle-subtitle">${vehicle.tipo} • ${vehicle.ano}</div>
            <div class="detail-price">R$ ${formatPrice(vehicle.preco)}</div>
            
            <div class="detail-specs">
                <div class="spec-item">
                    <div class="spec-label">Quilometragem</div>
                    <div class="spec-value">${formatNumber(vehicle.quilometragem)} km</div>
                </div>
                ${vehicle.cor ? `
                <div class="spec-item">
                    <div class="spec-label">Cor</div>
                    <div class="spec-value">${vehicle.cor}</div>
                </div>
                ` : ''}
                ${vehicle.combustivel ? `
                <div class="spec-item">
                    <div class="spec-label">Combustível</div>
                    <div class="spec-value">${vehicle.combustivel}</div>
                </div>
                ` : ''}
                ${vehicle.cambio ? `
                <div class="spec-item">
                    <div class="spec-label">Câmbio</div>
                    <div class="spec-value">${vehicle.cambio}</div>
                </div>
                ` : ''}
                ${vehicle.portas ? `
                <div class="spec-item">
                    <div class="spec-label">Portas</div>
                    <div class="spec-value">${vehicle.portas}</div>
                </div>
                ` : ''}
            </div>
            
            ${vehicle.descricao ? `
            <div class="detail-description">
                <h3>Descrição</h3>
                <p>${vehicle.descricao}</p>
            </div>
            ` : ''}
            
            ${vehicle.vendedor || vehicle.telefone ? `
            <div class="detail-seller">
                <h3>Informações do Vendedor</h3>
                ${vehicle.vendedor ? `<p><strong>Nome:</strong> ${vehicle.vendedor}</p>` : ''}
                ${vehicle.telefone ? `<p><strong>Telefone:</strong> ${vehicle.telefone}</p>` : ''}
                ${vehicle.cidade && vehicle.estado ? `<p><strong>Localização:</strong> ${vehicle.cidade} - ${vehicle.estado}</p>` : ''}
            </div>
            ` : ''}
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="editVehicle(${vehicle.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteVehicle(${vehicle.id})">Excluir</button>
            </div>
        `;
        
        document.getElementById('vehicleDetail').innerHTML = detailHtml;
        document.getElementById('detailModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading vehicle details:', error);
        alert('Erro ao carregar detalhes do veículo');
    }
}

// Close modal
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// Load brands for filter
async function loadBrands() {
    try {
        const response = await fetch(`${API_URL}/brands`);
        const brands = await response.json();
        
        const marcaFilter = document.getElementById('marcaFilter');
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            marcaFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading brands:', error);
    }
}

// Apply filters
function applyFilters() {
    const filters = {};
    
    const search = document.getElementById('searchInput').value;
    if (search) filters.search = search;
    
    const tipo = document.getElementById('tipoFilter').value;
    if (tipo) filters.tipo = tipo;
    
    const marca = document.getElementById('marcaFilter').value;
    if (marca) filters.marca = marca;
    
    const anoMin = document.getElementById('anoMin').value;
    if (anoMin) filters.anoMin = anoMin;
    
    const anoMax = document.getElementById('anoMax').value;
    if (anoMax) filters.anoMax = anoMax;
    
    const precoMin = document.getElementById('precoMin').value;
    if (precoMin) filters.precoMin = precoMin;
    
    const precoMax = document.getElementById('precoMax').value;
    if (precoMax) filters.precoMax = precoMax;
    
    loadVehicles(filters);
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('tipoFilter').value = '';
    document.getElementById('marcaFilter').value = '';
    document.getElementById('anoMin').value = '';
    document.getElementById('anoMax').value = '';
    document.getElementById('precoMin').value = '';
    document.getElementById('precoMax').value = '';
    
    loadVehicles();
}

// Show add vehicle form
function showAddVehicleForm() {
    currentEditId = null;
    document.getElementById('formTitle').textContent = 'Anunciar Veículo';
    document.getElementById('vehicleForm').reset();
    document.getElementById('addVehicleModal').style.display = 'block';
}

// Close add modal
function closeAddModal() {
    document.getElementById('addVehicleModal').style.display = 'none';
    currentEditId = null;
}

// Edit vehicle
async function editVehicle(id) {
    try {
        const response = await fetch(`${API_URL}/vehicles/${id}`);
        const vehicle = await response.json();
        
        currentEditId = id;
        document.getElementById('formTitle').textContent = 'Editar Veículo';
        
        // Fill form with vehicle data
        document.getElementById('tipo').value = vehicle.tipo || '';
        document.getElementById('marca').value = vehicle.marca || '';
        document.getElementById('modelo').value = vehicle.modelo || '';
        document.getElementById('ano').value = vehicle.ano || '';
        document.getElementById('preco').value = vehicle.preco || '';
        document.getElementById('quilometragem').value = vehicle.quilometragem || '';
        document.getElementById('cor').value = vehicle.cor || '';
        document.getElementById('combustivel').value = vehicle.combustivel || '';
        document.getElementById('cambio').value = vehicle.cambio || '';
        document.getElementById('portas').value = vehicle.portas || '';
        document.getElementById('descricao').value = vehicle.descricao || '';
        document.getElementById('imagem').value = vehicle.imagem || '';
        document.getElementById('vendedor').value = vehicle.vendedor || '';
        document.getElementById('telefone').value = vehicle.telefone || '';
        document.getElementById('cidade').value = vehicle.cidade || '';
        document.getElementById('estado').value = vehicle.estado || '';
        
        closeModal();
        document.getElementById('addVehicleModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading vehicle for edit:', error);
        alert('Erro ao carregar veículo para edição');
    }
}

// Handle form submit
async function handleSubmitVehicle(event) {
    event.preventDefault();
    
    const vehicleData = {
        tipo: document.getElementById('tipo').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        ano: parseInt(document.getElementById('ano').value),
        preco: parseFloat(document.getElementById('preco').value),
        quilometragem: parseInt(document.getElementById('quilometragem').value),
        cor: document.getElementById('cor').value,
        combustivel: document.getElementById('combustivel').value,
        cambio: document.getElementById('cambio').value,
        portas: parseInt(document.getElementById('portas').value) || 0,
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value,
        vendedor: document.getElementById('vendedor').value,
        telefone: document.getElementById('telefone').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };
    
    try {
        const url = currentEditId 
            ? `${API_URL}/vehicles/${currentEditId}` 
            : `${API_URL}/vehicles`;
        
        const method = currentEditId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save vehicle');
        }
        
        alert(currentEditId ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        closeAddModal();
        loadVehicles();
        loadBrands(); // Reload brands in case a new one was added
    } catch (error) {
        console.error('Error saving vehicle:', error);
        alert('Erro ao salvar veículo. Tente novamente.');
    }
}

// Delete vehicle
async function deleteVehicle(id) {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/vehicles/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete vehicle');
        }
        
        alert('Veículo excluído com sucesso!');
        closeModal();
        loadVehicles();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Erro ao excluir veículo. Tente novamente.');
    }
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const detailModal = document.getElementById('detailModal');
    const addModal = document.getElementById('addVehicleModal');
    
    if (event.target === detailModal) {
        closeModal();
    }
    if (event.target === addModal) {
        closeAddModal();
    }
}
