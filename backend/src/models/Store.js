import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // ✅ import the Sequelize instance

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: [20, 60]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 400]
    }
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

export default Store;
