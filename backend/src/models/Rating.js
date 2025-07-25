import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // ✅ import the Sequelize instance

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Stores',
      key: 'id'
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'storeId']
    }
  ]
});

export default Rating;
