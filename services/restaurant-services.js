const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantServices = {
  getRestaurants: (req, callback) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    Promise.all([
      Restaurant.findAndCountAll({
        include: [Category],
        where: {
          ...(categoryId ? { categoryId } : [])
        },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        const FavoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const LikedRestaurantId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurant.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantId.includes(r.id)
        }))
        return callback(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurant.count)
        })
      })
      .catch(err => callback(err))
  }
}

module.exports = restaurantServices
