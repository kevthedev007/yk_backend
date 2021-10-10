/*const sequelize = require("sequelize");

app.post('/customer', async (req, res) => {
    const { name, email, role } = res.body
    try {
        const user = await user.create({ name, email, role })
        return res.json(user)
    } catch (err) {
        console.log(err);
        return res.status(500).json(err)
    }
})

app.get('/customer/:uuid', async (req, res) => {
    const uuid= req.params.uuid
try {
    const customer = await customer.findOne({
        where: {uuid}
    })
    return res.json(customer)
}
});

app.listen({ port: 5000 }, async () => {
    console.log('server up on http://localhost:5000');
    await sequelize.sync({ force: true })
})
console.log('database synced');
*/
'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('customer', {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            full_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: false
            },
            phone_no: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM("active", "inactive"),
                defaultValue: "inactive"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('customer');
    }
};