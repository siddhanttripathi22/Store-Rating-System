import { Store, Rating, User } from '../models/index.js';
import { fn, col, Op } from 'sequelize';

const getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user.id;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
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
          attributes: [],
          required: false
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

    // Get user's ratings for these stores
    const userRatings = await Rating.findAll({
      where: {
        userId,
        storeId: { [Op.in]: stores.map(store => store.id) }
      }
    });

    const userRatingsMap = {};
    userRatings.forEach(rating => {
      userRatingsMap[rating.storeId] = rating.rating;
    });

    const storesWithUserRatings = stores.map(store => ({
      ...store.toJSON(),
      userRating: userRatingsMap[store.id] || null
    }));

    res.json(storesWithUserRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    const [ratingRecord, created] = await Rating.upsert({
      userId,
      storeId,
      rating
    });

    res.json({
      message: created ? 'Rating submitted successfully' : 'Rating updated successfully',
      rating: ratingRecord
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  getStores,
  submitRating
};