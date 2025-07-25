import sequelize from '../config/database.js';
import User from './user.js';
import Store from './store.js';
import Rating from './rating.js';

// Set up associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

export { sequelize, User, Store, Rating };
