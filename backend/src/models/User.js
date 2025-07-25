import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // ✅ use sequelize instance
import { hash, compare } from 'bcryptjs';

const User = sequelize.define('User', {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 16],
      is: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 400]
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'store_owner'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await hash(user.password, 12);
      }
    }
  }
});

// Instance method to check password
User.prototype.checkPassword = async function (password) {
  return await compare(password, this.password);
};

export default User;
