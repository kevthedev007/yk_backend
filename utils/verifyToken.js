const jwt = require('jsonwebtoken');


const verify = (req, res, next) => {
    const token = req.headers["access-token"];
    if(!token) return res.status(401).send('Access Denied!')
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next()
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = verify