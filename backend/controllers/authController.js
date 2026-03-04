const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { generateUserId, generateArtistId, generateBrandId } = require('../utils/idGenerator');

// Generate tokens
const generateTokens = (id, role) => {
  const accessToken = jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  const refreshToken = jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  
  return { accessToken, refreshToken };
};

// User Registration
exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, city } = req.body;
    
    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique user ID
    const userId = await generateUserId();
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (user_id, email, password, name, phone, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, email, name',
      [userId, email, hashedPassword, name, phone, city]
    );
    
    const tokens = generateTokens(userId, 'user');
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Artist Registration
exports.registerArtist = async (req, res) => {
  try {
    const { email, password, name, phone, city, category, bio, price_min, price_max } = req.body;
    
    const existing = await pool.query('SELECT * FROM artists WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const artistId = await generateArtistId();
    
    const result = await pool.query(
      'INSERT INTO artists (artist_id, email, password, name, phone, city, category, bio, price_min, price_max) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING artist_id, email, name, category',
      [artistId, email, hashedPassword, name, phone, city, category, bio, price_min, price_max]
    );
    
    const tokens = generateTokens(artistId, 'artist');
    
    res.status(201).json({
      message: 'Artist registered successfully',
      artist: result.rows[0],
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Brand Registration
exports.registerBrand = async (req, res) => {
  try {
    const { email, password, company_name, contact_person, phone, city, industry, website } = req.body;
    
    const existing = await pool.query('SELECT * FROM brands WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const brandId = await generateBrandId();
    
    const result = await pool.query(
      'INSERT INTO brands (brand_id, email, password, company_name, contact_person, phone, city, industry, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING brand_id, email, company_name',
      [brandId, email, hashedPassword, company_name, contact_person, phone, city, industry, website]
    );
    
    const tokens = generateTokens(brandId, 'brand');
    
    res.status(201).json({
      message: 'Brand registered successfully',
      brand: result.rows[0],
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is blocked' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const tokens = generateTokens(user.user_id, 'user');
    
    res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: 'user'
      },
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Artist Login
exports.loginArtist = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM artists WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const artist = result.rows[0];
    
    if (!artist.is_active) {
      return res.status(403).json({ error: 'Account is blocked' });
    }
    
    const validPassword = await bcrypt.compare(password, artist.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const tokens = generateTokens(artist.artist_id, 'artist');
    
    res.json({
      message: 'Login successful',
      artist: {
        artist_id: artist.artist_id,
        email: artist.email,
        name: artist.name,
        category: artist.category,
        role: 'artist'
      },
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Brand Login
exports.loginBrand = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM brands WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const brand = result.rows[0];
    
    if (!brand.is_active) {
      return res.status(403).json({ error: 'Account is blocked' });
    }
    
    const validPassword = await bcrypt.compare(password, brand.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const tokens = generateTokens(brand.brand_id, 'brand');
    
    res.json({
      message: 'Login successful',
      brand: {
        brand_id: brand.brand_id,
        email: brand.email,
        company_name: brand.company_name,
        role: 'brand'
      },
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const tokens = generateTokens(admin.id, 'admin');
    
    res.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      ...tokens
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};
