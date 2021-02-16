const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;

const init = async () => {
    try {
        await mongoose.connect(mongoDB, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
            })
            .then(
                () => { console.info(`Connected to database`) },
                (error) => { throw new Error(error) }
            ).catch(
                error => {throw new Error(error) }
            );
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    init
};
