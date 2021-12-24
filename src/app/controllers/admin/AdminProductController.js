const Product = require('../../models/ProductModel')
const { multipleMongooseToObject } = require('../../../util/mongoose.js')


class AdminProductController {
    index(req, res, next) {
        Product.find({})
            .then(product => {
                res.render('admin/product', { layout: 'admin.hbs', product: multipleMongooseToObject(product) })
            })
            .catch(next)
    }



    async create(req, res, next) {
        try {
            const _user = await Product.findOne({ email: req.body.email }).exec();
            if (!_user) {
                const formData = req.body
                formData.avatar = "default.jpg"
                if (req.body.level == "User") {
                    formData.level = 0
                } else {
                    formData.level = 1
                }

                const user = new User(formData)
                user.save()
                res.send({ status: true, data: user })
            } else {
                res.send({ status: false })
            }
        } catch (err) {
            res.send(err)
        }

    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            await Product.deleteOne({ _id: id })
            res.send({ status: true })
        } catch (err) {
            res.send({ status: false })
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const level = req.body.level
            const query = { _id: id }
            await Product.findOneAndUpdate(query, { $set: { level: level } })
                .then(user => {
                    res.send({ status: true, data: user })
                })
                .catch(next)
        } catch (err) {
            res.send({ status: false })
        }
    }

}

module.exports = new AdminProductController();
