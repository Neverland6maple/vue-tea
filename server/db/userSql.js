const jwt = require("jsonwebtoken");
const User = {
  queryTel:(body)=>{
    return `select * from user where tel = ${body.tel}`
  },
  queryPwd:(body)=>{
    return `select * from user where (tel = ${body.tel}) and pwd = ${body.pwd}`
  },
  insertUser:(body)=>{
    //用户信息
    const payload = {tel:body.tel}
    //口令
    const secret = 'acfun'
    //生成token
    const token = jwt.sign(payload,secret,{
      expiresIn:600
    });
    return `insert into user (tel,pwd,imgUrl,nickName,token) values (${'"'+body.tel+'"'},${body.pwd || '0'},"${'/images/user.jpeg'}",${'"'+body.tel+'"'},${'"'+token+'"'})`
  }
}
module.exports = User;
