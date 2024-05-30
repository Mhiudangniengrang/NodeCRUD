require("dotenv").config();
import jwt from "jsonwebtoken";

const createJWT = () => {
  let payload = { name: "Bin", address: "hcm" };
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: "30m" });
    console.log(token);
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (err) {
    // Log the error or handle it as needed
    console.log(err);
    // Return null to indicate token verification failure
    return null;
  }
  return data;
};
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).send("Unauthorized"); // Không có token, trả về lỗi Unauthorized
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
    req.user = decoded; // Lưu thông tin user vào req để sử dụng trong các xử lý tiếp theo
    next(); // Chuyển tiếp yêu cầu đến middleware hoặc route tiếp theo
  } catch (error) {
    return res.status(403).send("Invalid token"); // Token không hợp lệ, trả về lỗi Forbidden
  }
};
module.exports = {
  createJWT,
  verifyToken,
  authenticateToken,
};
