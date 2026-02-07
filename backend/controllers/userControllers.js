import { User } from "../models/userModel.js";
import TryCatch from "../utils/Trycatch.js";



export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(404).json({
      message: "No User with this id",
    });

  res.json(user);
});