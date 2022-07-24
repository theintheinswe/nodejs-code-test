const Joi = require('joi');
const jwt = require('jsonwebtoken');
const api_model = require('../models/api_model');

function generateAuthToken(user) {
	const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
	return token;
}

function generateRefreshToken(user) {
	const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1y' });
	return (token)
}


// Customer
exports.customer_login = async (req, res) => {
	const schema = Joi.object({
		customer_email: Joi.string().email().required()
	});

	const { error, value } = schema.validate(req.body);
	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.loginCustomer(value.customer_email, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0) {
					const accessToken = generateAuthToken({ id: result[0].id, customer_email: result[0].customer_email });
					const refreshToken = generateRefreshToken({ id: result[0].id, customer_email: result[0].customer_email });
					res.status(200).json({ customer_id: result[0].id, accessToken: accessToken, refreshToken: refreshToken })
				} else {

					res.status(202).json({ "message": "Customer not registered" });
					res.end();
				}
			}
		})
	}
}

exports.customer_register = (req, res) => {
	const schema = Joi.object({
		customer_email: Joi.string().email().required(),
		customer_name: Joi.string().required(),
		customer_phone: Joi.number().required(),
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.customer_create_check(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0) {
					res.status(202).json({ message: "Email already exists!" })
				} else {
					api_model.customer_create(value, function (err1, result1) {
						if (err1) {
							res.status(505).send("Internal Server Error")
						} else {
							const accessToken = generateAuthToken({ id: result1.customer_id, customer_email: value.customer_email });
							const refreshToken = generateRefreshToken({ id: result1.customer_id, customer_email: value.customer_email });
							res.status(200).json({ message: "Success", ...result1, accessToken: accessToken, refreshToken: refreshToken })
						}
					})
				}
			}
		});
	}
}

exports.customer_update = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		customer_email: Joi.string().email().required(),
		customer_name: Joi.string().required(),
		customer_phone: Joi.number().required(),
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		var customer = { ...value };
		delete customer.customer_id;
		api_model.customer_update_check(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0) {
					res.status(202).json({ message: "Email already exists!" })
				} else {
					api_model.customer_update(customer, { id: value.customer_id }, function (err1, result1) {
						if (err1) {
							res.status(505).send("Internal Server Error")
						} else {
							res.status(200).json({ ...result1 })
						}
					})
				}
			}
		});
	}
}

// eVoucher
exports.eVoucher_save = (req, res) => {
	const schema = Joi.object({
		evoucher_id: Joi.number().optional().allow(""),
		customer_id: Joi.number().required(),
		title: Joi.string().required(),
		description: Joi.string().optional().allow(''),
		expiry_date: Joi.string().required(),
		image: Joi.string().optional().allow(''),
		amount: Joi.number().required(),
		discount: Joi.number().required(),
		quantity: Joi.number().required(),
		status: Joi.string().optional().allow('').valid('Active', 'Inactive'),
		max_limit: Joi.number().required(),
		user_limit: Joi.number().optional(),
		buy_type: Joi.string().required().valid("Onlyme", "Others")
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		var voucher = { ...value };
		delete voucher.evoucher_id;
		voucher.user_limit = value.buy_type == "Others" ? value.user_limit : null;

		if (value.evoucher_id) {			
			api_model.eVoucher_update(voucher, { evoucher_id: value.evoucher_id }, function (err1, result1) {
				if (err1) {
					res.status(505).send("Internal Server Error")
				} else {
					res.status(200).json({ ...result1 })
				}
			})	
		} else {
			api_model.eVoucher_create(voucher, function (err, result) {
				if (err) {
					res.status(505).send("Internal Server Error")
				} else {
					res.status(200).json({ message: "Success", ...result })
				}
			})
		}
	}
}


exports.eVoucher_list = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		status: Joi.string().optional().allow('').valid('Active', 'Inactive'),
		payment_status: Joi.string().optional().allow('').valid('Paid', 'Unpaid', 'Cancel')
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.eVoucher_list(value, function (err, result) {
			if (err) {
				res.status(403)
			} else {
				res.status(200).json({ message: "Success", ...result })
			}
		})
	}
}

exports.eVoucher_detail = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		evoucher_id: Joi.number().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.eVoucher_detail(value, function (err, result) {
			if (err) {
				res.status(403)
			} else {
				res.status(200).json({ message: "Success", ...result })
			}
		})
	}
}

// Payment
exports.payment_methods_list = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.payment_methods_list(function (err, result) {
			if (err) {
				res.status(400).json({
					error: err
				});
			} else {
				res.status(200).json({ message: "Success" , ...result});
			}
		});
	}
};

exports.check_out_list = (req, res) => {

	const schema = Joi.object({
		customer_id: Joi.number().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.check_out_list(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {				
				res.status(200).json({ message: "Success", ...result })
			}
		})
	}
}

exports.make_payment = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		evoucher_id: Joi.number().required(),
		payment_method_id: Joi.number().required(),
		payment_status: Joi.string().required().valid('Paid', 'Unpaid', 'Cancel'),
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.make_payment_check(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if(result && result.length >0){
					api_model.eVoucher_update({ payment_method_id: value.payment_method_id, payment_status: value.payment_status }, { evoucher_id: value.evoucher_id }, function (err, result) {
						if (err) {
							res.status(505).send("Internal Server Error")
						} else {
							res.status(200).json({ message: "Success!" })
						}
					})
				}else{
					res.status(202).json({ message: "Failed!"})
				}				
			}
		})
	}
}


// Promo Code
exports.set_promo_code = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		evoucher_id: Joi.number().required(),
		qr_code_image: Joi.string().required(),
		promo_code: Joi.string().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.promo_code_check(value.promo_code, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0) {
					res.status(202).json({ message: "Promo Code already exists!" })
				} else {
					api_model.eVoucher_update(value, { evoucher_id: value.evoucher_id }, function (err, result) {
						if (err) {
							res.status(505).send("Internal Server Error")
						} else {
							res.status(200).json({ ...result })
						}
					})
				}
			}
		});
	}
}

exports.verify_promo_code = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		evoucher_id: Joi.number().required(),
		promo_code: Joi.string().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.verify_promo_code(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0)
					res.status(200).json({ message: "Valid Code!" })
				else
					res.status(200).json({ message: "Invalid Code!" })
			}
		})
	}
}

exports.use_promo_code = (req, res) => {
	const schema = Joi.object({
		customer_id: Joi.number().required(),
		evoucher_id: Joi.number().required(),
		promo_code: Joi.string().required()
	});

	const { error, value } = schema.validate(req.body);

	if (error) {
		res.status(201).json({ error: error.details[0].message });
		return;
	} else {
		api_model.verify_promo_code(value, function (err, result) {
			if (err) {
				res.status(505).send("Internal Server Error")
			} else {
				if (result && result.length > 0) {
					api_model.eVoucher_update({ status: "Inactive" }, { evoucher_id: value.evoucher_id }, function (err, result) {
						if (err) {
							res.status(505).send("Internal Server Error")
						} else {
							res.status(200).json({ message: "Success" })
						}
					})
				}
				else
					res.status(200).json({ message: "Invalid Code!" })
			}
		})
	}
}