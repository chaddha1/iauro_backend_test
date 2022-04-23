const UsersModel = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function checkAdmin(){
    try {
        let adminUser = await UsersModel.findOne({role : 'admin'});
        if(!adminUser){
            const hashPass = await bcrypt.hash(process.env.ADMIN_PASS,saltRounds);
            const adminObj = new UsersModel({
                role : 'admin',
                firstName : 'Admin',
                lastName : 'role',
                email : process.env.ADMIN_EMAIL,
                password : hashPass,
            });

            await adminObj.save();
        }
    } catch (error) {
        throw error;
    }
}

checkAdmin();