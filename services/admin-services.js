const { Restaurant, Category } = require('../models')

const adminServices = {
  getRestaurants: (req, callback) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
      callback(null, { restaurants })
    })
      .catch(err => callback(err))
  },

  deleteRestaurant: (req, callback) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error('Restaurant not found!')
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => callback(null, { restaurant: deletedRestaurant }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
