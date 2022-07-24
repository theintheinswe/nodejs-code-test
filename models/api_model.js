const { mysql, poolPromise } = require('../helpers/db');

// Customer
exports.loginCustomer = async (customer_email, callback) => {
    try {
        const result = await poolPromise.query('select * from customer WHERE customer_email = ? limit 1', customer_email)
        if (result && result.length > 0) {            
            callback(null, result);
        } else {           
            callback(null, []);
        }
    } catch (err) { 
        callback(err, null)
    }
}

exports.customer_create_check = async (filter, callback) => {
    try {
        const result = await poolPromise.query('SELECT * FROM customer WHERE customer_email = ?', [filter.customer_email])
        if (result.length > 0) {
            callback(null, result);
        } else {
            callback(null, []);
        }
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.customer_update_check = async (filter, callback) => {
    try {
        const result = await poolPromise.query('SELECT * FROM customer WHERE customer_email = ? AND id != ? ', [filter.customer_email, filter.customer_id])
        if (result.length > 0) {
            callback(null, result);
        } else {
            callback(null, []);
        }
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.customer_create = async (value, callback) => {
    try {
        const customerResult = await poolPromise.query("INSERT INTO customer SET ?", value);
        callback(null, {customer_id: customerResult.insertId})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.customer_update = async (value, filter, callback) => {
    try {
        await poolPromise.query("UPDATE `customer` SET ? WHERE ? ",[ value, filter]);
        callback(null, {messgae: "Success"})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

// eVoucher
exports.eVoucher_list = async (filter, callback) => {
    try {
        var strQuery = "SELECT e.*, c.customer_name, c.customer_phone, pm.name AS payment_method FROM `evoucher` e LEFT JOIN `customer` c ON c.id = e.customer_id LEFT JOIN `payment_methods` pm ON pm.payment_method_id = e.payment_method_id WHERE e.customer_id = ? "
        if(filter.status)
            strQuery += " AND e.status = '" + poolPromise.mysql_escape(filter.status) + "'"
        if(filter.payment_status)
            strQuery += " AND e.payment_status = '" + poolPromise.mysql_escape(filter.payment_status) + "'"
        const queryString = await poolPromise.format(strQuery);       
        const voucherResult = await poolPromise.query(queryString, [filter.customer_id]);
        callback(null, {total:voucherResult.length, result : voucherResult})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.eVoucher_create = async (value, callback) => {
    try { 
        const voucherResult = await poolPromise.query("INSERT INTO evoucher SET ?", value);
        callback(null, {evoucher_id:voucherResult.insertId})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.eVoucher_update = async (value, filter, callback) => {
    try {
        await poolPromise.query("UPDATE `evoucher` SET ? WHERE ? ",[value, filter]);
        callback(null, {messgae: "Success"})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.eVoucher_detail = async (filter, callback) => {
    try {
        const voucherResult = await poolPromise.query("SELECT e.*, c.customer_name, c.customer_phone, pm.name AS payment_method FROM `evoucher` e LEFT JOIN `customer` c ON c.id = e.customer_id LEFT JOIN `payment_methods` pm ON pm.payment_method_id = e.payment_method_id WHERE e.evoucher_id = ? AND e.customer_id LIMIT 1", [filter.evoucher_id, filter.customer_id]);
        callback(null, {result : voucherResult})
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

// Payment
exports.payment_methods_list = async (callback) => {
    try {
        const result = await poolPromise.query('SELECT * FROM `payment_methods`')
        if (result.length > 0) {
            callback(null, {result : result});
        } else {
            callback("No record found!", null);
        }
    } catch (err) { 
        console.log(err);       
        callback(err.code, null);
    }
}

exports.check_out_list = async (filter, callback) => {
    try {
        const voucherResult = await poolPromise.query("SELECT e.* FROM `evoucher` e WHERE e.expiry_date > NOW() AND e.payment_status = 'Unpaid' AND e.status = 'Active' AND  e.customer_id = ? AND e.promo_code IS NULL", [filter.customer_id]);
        if (voucherResult.length > 0) {
            callback(null, {total:voucherResult.length, result : voucherResult})
        } else {
            callback(null, {total:voucherResult.length, result : []});
        }        
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.make_payment_check = async (filter, callback) => {
    try {
        const voucherResult = await poolPromise.query("SELECT e.* FROM `evoucher` e WHERE e.expiry_date > NOW() AND e.payment_status = 'Unpaid' AND e.status = 'Active' AND  e.customer_id = ? AND e.evoucher_id = ? AND e.promo_code IS NULL", [filter.customer_id, filter.evoucher_id]);
        if (voucherResult.length > 0) {
            callback(null, voucherResult)
        } else {
            callback(null, []);
        }        
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

// Promo Code
exports.promo_code_check = async (promo_code, callback) => {
    try {
        const result = await poolPromise.query('SELECT * FROM evoucher WHERE promo_code = ? ', [promo_code])
        if (result.length > 0) {
            callback(null, result);
        } else {
            callback(null, []);
        }
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}

exports.verify_promo_code = async (filter, callback) => {
    try {
        const voucherResult = await poolPromise.query("SELECT e.* FROM `evoucher` e WHERE e.expiry_date > NOW() AND e.payment_status = 'Paid' AND e.status = 'Active' AND e.evoucher_id = ? AND e.customer_id = ? AND e.promo_code = ?  LIMIT 1", [filter.evoucher_id, filter.customer_id, filter.promo_code]);
        if (voucherResult.length > 0) {
            callback(null, voucherResult);
        } else {
            callback(null, []);
        }        
    } catch (err) {
        console.log(err);
        callback(err, null)
    }
}