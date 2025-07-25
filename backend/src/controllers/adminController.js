import { Store, Rating, User } from '../models/index.js';
import { fn, col,Op } from 'sequelize';

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, address, role });
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerEmail } = req.body;
    
    const owner = await User.findOne({ where: { email: ownerEmail, role: 'store_owner' } });
    if (!owner) {
      return res.status(400).json({ message: 'Store owner not found' });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: owner.id
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: []
        }
      ],
      attributes: {
        include: [
          [fn('AVG', col('ratings.rating')), 'averageRating'],
          [fn('COUNT', col('ratings.id')), 'ratingCount']
        ]
      },
      group: ['Store.id'],
      order: [[sortBy, sortOrder]]
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getDashboard,
  createUser,
  createStore,
  getUsers,
  getStores
};