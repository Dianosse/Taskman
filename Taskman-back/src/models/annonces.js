const { DataTypes } = require("sequelize")
const db = require('../config/database')

const Annonces = db.define('annonces', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  titre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  availability: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tarif_type: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  tarif: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0
  },
  modality: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.Sequelize.fn('now')
  },
  id_creator: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  tableName: 'annonces',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "pk_annonces",
      unique: true,
      fields: [
        { name: "id" },
      ]
    },
  ]
});

module.exports = Annonces;
