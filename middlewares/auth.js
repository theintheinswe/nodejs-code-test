const jwt = require('jsonwebtoken');

module.exports = {
  verifyAccessToken:(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {      
      if (err) return res.sendStatus(403)
  
      if(req.params.customer_id || req.body.customer_id){      
        if(req.params.customer_id == user.id || req.body.customer_id == user.id){        
          req.user = user
          next()
        }else{       
          return res.status(403).send("Invalid Customer")
        }
      }else{      
        return res.status(403).send("Invalid Customer")
      } 
    })
  }
} 
