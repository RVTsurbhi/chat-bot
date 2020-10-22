'use strict';

const success = (res, message, code) => {
	res.status(code).json({
		is_success: true,
		message: message,
		statusCode: code
	});
};

const data = (res, item, code, message = '') => {
	res.status(code).json({
		is_success: true,
		data: item,
		message: message,
		statusCode: code
	});
};

const linkData = (res, item, code, link = '') => {
	res.status(code).json({
		is_success: true,
		data: item,
		link: link,
		statusCode: code
	});
};

const failure = (res, error, code) => {
	res.status(code).json({
		is_success: false,
		message: error.message ? error.message : error,
		statusCode: code
	});
};

const page = (res, items, total, page_no, code) => {
	res.status(code).json({
		is_success: true,
		data: {
			items: items,
			skip: page_no || 0,
			total: total || items.length
		},
		statusCode: code
	});
};

module.exports = {
	success,
	data,
	failure,
	page,
	linkData
};
