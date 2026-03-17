const { DataTypes } = require("sequelize")
const db = require('../config/database')

const Users = db.define('users', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: "users_email_key"
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  bio: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  db,
  tableName: 'users',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pk_user",
      unique: true,
      fields: [
        { name: "id" },
      ]
    },
    {
      name: "users_email_key",
      unique: true,
      fields: [
        { name: "email" },
      ]
    },
  ]
});

module.exports = Users;