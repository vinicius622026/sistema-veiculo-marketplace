const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./marketplace.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo VARCHAR(50) NOT NULL,
      marca VARCHAR(100) NOT NULL,
      modelo VARCHAR(100) NOT NULL,
      ano INTEGER NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      quilometragem INTEGER NOT NULL,
      cor VARCHAR(50),
      combustivel VARCHAR(50),
      cambio VARCHAR(50),
      portas INTEGER,
      descricao TEXT,
      imagem VARCHAR(255),
      vendedor VARCHAR(100),
      telefone VARCHAR(20),
      cidade VARCHAR(100),
      estado VARCHAR(2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table vehicles ready');
      // Insert sample data if table is empty
      db.get('SELECT COUNT(*) as count FROM vehicles', (err, row) => {
        if (!err && row.count === 0) {
          insertSampleData();
        }
      });
    }
  });
}

// Insert sample data
function insertSampleData() {
  const sampleVehicles = [
    {
      tipo: 'Carro',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2022,
      preco: 125000.00,
      quilometragem: 15000,
      cor: 'Prata',
      combustivel: 'Flex',
      cambio: 'Automático',
      portas: 4,
      descricao: 'Corolla XEI 2.0 em perfeito estado, único dono, revisões em concessionária.',
      imagem: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Toyota+Corolla',
      vendedor: 'João Silva',
      telefone: '(11) 98765-4321',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    {
      tipo: 'Carro',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2021,
      preco: 115000.00,
      quilometragem: 25000,
      cor: 'Preto',
      combustivel: 'Gasolina',
      cambio: 'Manual',
      portas: 4,
      descricao: 'Honda Civic EXL, completo, muito conservado.',
      imagem: 'https://via.placeholder.com/400x300/333333/ffffff?text=Honda+Civic',
      vendedor: 'Maria Santos',
      telefone: '(21) 99876-5432',
      cidade: 'Rio de Janeiro',
      estado: 'RJ'
    },
    {
      tipo: 'Carro',
      marca: 'Volkswagen',
      modelo: 'Gol',
      ano: 2020,
      preco: 52000.00,
      quilometragem: 45000,
      cor: 'Branco',
      combustivel: 'Flex',
      cambio: 'Manual',
      portas: 4,
      descricao: 'Gol 1.6 MSI, econômico e confiável.',
      imagem: 'https://via.placeholder.com/400x300/ffffff/333333?text=VW+Gol',
      vendedor: 'Carlos Oliveira',
      telefone: '(31) 98765-1234',
      cidade: 'Belo Horizonte',
      estado: 'MG'
    },
    {
      tipo: 'Moto',
      marca: 'Honda',
      modelo: 'CG 160',
      ano: 2023,
      preco: 14500.00,
      quilometragem: 5000,
      cor: 'Vermelho',
      combustivel: 'Gasolina',
      cambio: 'Manual',
      portas: 0,
      descricao: 'CG 160 Fan, praticamente nova, baixa quilometragem.',
      imagem: 'https://via.placeholder.com/400x300/cc0000/ffffff?text=Honda+CG+160',
      vendedor: 'Pedro Costa',
      telefone: '(41) 99123-4567',
      cidade: 'Curitiba',
      estado: 'PR'
    },
    {
      tipo: 'Caminhão',
      marca: 'Mercedes-Benz',
      modelo: 'Accelo 1016',
      ano: 2019,
      preco: 185000.00,
      quilometragem: 85000,
      cor: 'Branco',
      combustivel: 'Diesel',
      cambio: 'Manual',
      portas: 2,
      descricao: 'Caminhão Mercedes-Benz Accelo, ideal para entregas urbanas.',
      imagem: 'https://via.placeholder.com/400x300/cccccc/333333?text=MB+Accelo',
      vendedor: 'Transportes Silva',
      telefone: '(11) 3456-7890',
      cidade: 'Guarulhos',
      estado: 'SP'
    },
    {
      tipo: 'Carro',
      marca: 'Chevrolet',
      modelo: 'Onix',
      ano: 2023,
      preco: 78000.00,
      quilometragem: 8000,
      cor: 'Cinza',
      combustivel: 'Flex',
      cambio: 'Automático',
      portas: 4,
      descricao: 'Onix Plus LTZ 1.0 Turbo, seminovo com garantia de fábrica.',
      imagem: 'https://via.placeholder.com/400x300/666666/ffffff?text=Chevrolet+Onix',
      vendedor: 'Ana Paula',
      telefone: '(48) 98888-7777',
      cidade: 'Florianópolis',
      estado: 'SC'
    },
    {
      tipo: 'Moto',
      marca: 'Yamaha',
      modelo: 'Fazer 250',
      ano: 2021,
      preco: 16800.00,
      quilometragem: 18000,
      cor: 'Azul',
      combustivel: 'Gasolina',
      cambio: 'Manual',
      portas: 0,
      descricao: 'Yamaha Fazer 250, moto esportiva em ótimo estado.',
      imagem: 'https://via.placeholder.com/400x300/0044aa/ffffff?text=Yamaha+Fazer',
      vendedor: 'Lucas Mendes',
      telefone: '(85) 99321-6547',
      cidade: 'Fortaleza',
      estado: 'CE'
    },
    {
      tipo: 'Carro',
      marca: 'Fiat',
      modelo: 'Argo',
      ano: 2022,
      preco: 68000.00,
      quilometragem: 22000,
      cor: 'Vermelho',
      combustivel: 'Flex',
      cambio: 'Manual',
      portas: 4,
      descricao: 'Fiat Argo Drive 1.0, completo e econômico.',
      imagem: 'https://via.placeholder.com/400x300/cc0000/ffffff?text=Fiat+Argo',
      vendedor: 'Roberto Lima',
      telefone: '(71) 98765-4321',
      cidade: 'Salvador',
      estado: 'BA'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO vehicles (tipo, marca, modelo, ano, preco, quilometragem, cor, combustivel, cambio, portas, descricao, imagem, vendedor, telefone, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleVehicles.forEach(vehicle => {
    stmt.run(
      vehicle.tipo,
      vehicle.marca,
      vehicle.modelo,
      vehicle.ano,
      vehicle.preco,
      vehicle.quilometragem,
      vehicle.cor,
      vehicle.combustivel,
      vehicle.cambio,
      vehicle.portas,
      vehicle.descricao,
      vehicle.imagem,
      vehicle.vendedor,
      vehicle.telefone,
      vehicle.cidade,
      vehicle.estado
    );
  });

  stmt.finalize();
  console.log('Sample data inserted');
}

// API Routes

// Get all vehicles with filters
app.get('/api/vehicles', (req, res) => {
  const { tipo, marca, precoMin, precoMax, anoMin, anoMax, search } = req.query;
  
  let query = 'SELECT * FROM vehicles WHERE 1=1';
  const params = [];

  if (tipo) {
    query += ' AND tipo = ?';
    params.push(tipo);
  }

  if (marca) {
    query += ' AND marca = ?';
    params.push(marca);
  }

  if (precoMin) {
    query += ' AND preco >= ?';
    params.push(parseFloat(precoMin));
  }

  if (precoMax) {
    query += ' AND preco <= ?';
    params.push(parseFloat(precoMax));
  }

  if (anoMin) {
    query += ' AND ano >= ?';
    params.push(parseInt(anoMin));
  }

  if (anoMax) {
    query += ' AND ano <= ?';
    params.push(parseInt(anoMax));
  }

  if (search) {
    query += ' AND (marca LIKE ? OR modelo LIKE ? OR descricao LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single vehicle
app.get('/api/vehicles/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM vehicles WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Vehicle not found' });
    } else {
      res.json(row);
    }
  });
});

// Create new vehicle
app.post('/api/vehicles', (req, res) => {
  const {
    tipo, marca, modelo, ano, preco, quilometragem, cor,
    combustivel, cambio, portas, descricao, imagem,
    vendedor, telefone, cidade, estado
  } = req.body;

  if (!tipo || !marca || !modelo || !ano || !preco || quilometragem === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(`
    INSERT INTO vehicles (tipo, marca, modelo, ano, preco, quilometragem, cor, combustivel, cambio, portas, descricao, imagem, vendedor, telefone, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [tipo, marca, modelo, ano, preco, quilometragem, cor, combustivel, cambio, portas, descricao, imagem, vendedor, telefone, cidade, estado],
  function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Vehicle created successfully' });
    }
  });
});

// Update vehicle
app.put('/api/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const {
    tipo, marca, modelo, ano, preco, quilometragem, cor,
    combustivel, cambio, portas, descricao, imagem,
    vendedor, telefone, cidade, estado
  } = req.body;

  db.run(`
    UPDATE vehicles 
    SET tipo=?, marca=?, modelo=?, ano=?, preco=?, quilometragem=?, cor=?, combustivel=?, cambio=?, portas=?, descricao=?, imagem=?, vendedor=?, telefone=?, cidade=?, estado=?
    WHERE id=?
  `,
  [tipo, marca, modelo, ano, preco, quilometragem, cor, combustivel, cambio, portas, descricao, imagem, vendedor, telefone, cidade, estado, id],
  function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
    } else {
      res.json({ message: 'Vehicle updated successfully' });
    }
  });
});

// Delete vehicle
app.delete('/api/vehicles/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM vehicles WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Vehicle not found' });
    } else {
      res.json({ message: 'Vehicle deleted successfully' });
    }
  });
});

// Get unique brands
app.get('/api/brands', (req, res) => {
  db.all('SELECT DISTINCT marca FROM vehicles ORDER BY marca', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => row.marca));
    }
  });
});

// Get vehicle types
app.get('/api/types', (req, res) => {
  db.all('SELECT DISTINCT tipo FROM vehicles ORDER BY tipo', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => row.tipo));
    }
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
