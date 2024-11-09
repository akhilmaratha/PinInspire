import jwt from "jsonwebtoken"

const generateToken=(id,res)=>{
    const token = jwt.sign({ id }, process.env.SECRET_KEY, 
        { expiresIn: '15d' });
    res.cookie("token", token,{
        maxAge:15*24*60*60*1000,
        httpsOnly: true,
        // sameSite: "strict"
    });
}
export default generateToken;