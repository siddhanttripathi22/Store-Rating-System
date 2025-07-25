import { Store, Rating, User } from '../models/index.js';
import { fn, col } from 'sequelize';



const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({
      where: { ownerId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const averageRating = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [
        [fn('AVG', col('rating')), 'average'],
        [fn('COUNT', col('id')), 'count']
      ]
    });

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: parseFloat(averageRating.dataValues.average) || 0,
      totalRatings: parseInt(averageRating.dataValues.count) || 0,
      ratings: store.ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getDashboard
};