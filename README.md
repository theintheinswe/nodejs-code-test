# nodejs-code-test
 eVoucher Management System
 
 ------------------------------------------------------------------------------
 Header key => authorization
Header value => Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0aW5nQGdtYWlsLmNvbSIsImlhdCI6MTY1ODU3NzY0MSwiZXhwIjoxNjU4NjY0MDQxfQ.Z1KJ3QwkvB1ty9N6IG0iPEV6-QPJVRVk8cZZdz0SD-A

post => localhost:4000/api/customer_register
{
"customer_email":"customer@gmail.com",
"customer_name":"Customer",
"customer_phone":1234567894
}


post => localhost:4000/api/customer_login
{"customer_email":"customer@gmail.com"}

post => localhost:4000/api/customer_update
{
"customer_id":"1",
"customer_email":"customer@gmail.com",
"customer_name":"Customer",
"customer_phone":1234567894
}


post => localhost:4000/api/eVoucher_save
{
"customer_id":"1",
"evoucher_id":"",  
"title":"Voucher1",
"description":"Testing",
"expiry_date":"2022-07-23 23:58:03",
"image":"",
"discount":10,
"amount":100,
"quantity":5,
"max_limit":5,
"user_limit":2,
"buy_type":"Onlyme"
}

post => localhost:4000/api/eVoucher_list
{
"customer_id":"1",
"status":"", 
"payment_status":""
}

post => localhost:4000/api/eVoucher_detail
{
"customer_id":"1",
"evoucher_id":"1"
}

post => localhost:4000/api/payment_methods_list
{"customer_id":"1"}

post => localhost:4000/api/check_out_list
{"customer_id":"1"}


post => localhost:4000/api/make_payment
{
"customer_id":"1",
"evoucher_id":"1",
"payment_method_id":1,
"payment_status":"Paid"
}

post => localhost:4000/api/set_promo_code
{
"customer_id":"1",
"evoucher_id":"1",
"qr_code_image":"/images/qr_code_image",
"promo_code":"1234asdf"
}

post => localhost:4000/api/verify_promo_code
{
"customer_id":"1",
"evoucher_id":"1",
"promo_code":"1234asdf"
}

post => localhost:4000/api/use_promo_code
{
"customer_id":"1",
"evoucher_id":"1",
"promo_code":"1234asdf"
}
