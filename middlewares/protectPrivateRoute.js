module.exports = function protectPrivateRoute(req, res, next) {
    console.log('coucou la middleware')
    if (req.session.currentUser) next();
    else return res.status(401).json({ message: "Unauthorized" });
};



    
