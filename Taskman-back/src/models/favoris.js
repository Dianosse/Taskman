const { DataTypes } = require("sequelize")
const db = require('../config/database')

const Favoris = db.define('favoris', {
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  id_annonce: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'annonces',
      key: 'id'
    }
  }
}, {
  db,
  tableName: 'favoris',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pk_favoris",
      unique: true,
      fields: [
        { name: "id_user" },
        { name: "id_annonce" },
      ]
    },
  ]
});


module.exports = Favoris;