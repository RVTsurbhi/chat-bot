const responseHelper = require('../helpers/responses');

const errorCode = error => {
	let code = 400;
	switch (error.message) {
		case 'ValidationError':
			code = 422;
			break;
		case 'Internal server Error':
			code = 500;
			break;
		case 'JsonWebTokenError':
			break;
		case 'Unauthorized':
			code = 401;
			break;
		case 'Forbidden':
			code = 403
			break;
		case 'Not Found':
			code=404
			break;
		default:
			break;
	}
	return code;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
	const code = errorCode(error);
	responseHelper.failure(res, error, code);
};

module.exports = errorHandler;
