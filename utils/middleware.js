const jwtHelper = require('../helpers/jwtHelper');
const userModel = require('../models/user');


/*******************************************************************************
Function to verify Access Token for Users.
*******************************************************************************/
const verifyToken = () => {
	return async (req, res, next) => {
		try {
			let token = req.header('Authorization');
			if (!token) {
				throw Error("Token is required");
			}
			let sessionData = await userModel.findOne({ token : token });
			if (!sessionData) {
				throw Error("UnAuthorized")
			}
			let userDetails = await jwtHelper.decodeToken(token)
			if (userDetails.message) {
				throw Error("Token Expired")
            }
			req.user = sessionData;
			next();
		} catch (err) {
			next(err);
		}
	};
};

module.exports = {
	verifyToken
};
