// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: "" // Permite que el perfil esté vacío inicialmente
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
