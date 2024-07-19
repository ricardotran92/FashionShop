import User from "../models/user.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import fs from "fs";

console.log("start point",process.env.GOOGLE_CLIENT_ID)
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require('./models/userModel'); // Đường dẫn tới file model người dùng của bạn
// Đường dẫn tới file cấu hình local
const localConfigPath = "backend/config/config.env.local";
const globalConfigPath = "backend/config/config.env.global";

// Chỉ sử dụng config.env ở Development
if (process.env.NODE_ENV !== "PRODUCTION") {
  // Kiểm tra sự tồn tại của file cấu hình local -> ưu tiên sử dụng
  if (fs.existsSync(localConfigPath)) {
    console.log(localConfigPath);
    dotenv.config({ path: localConfigPath }); // cho phép ghi đè các biến môi trường đã tồn tại
  } else if (fs.existsSync(globalConfigPath)) {
    dotenv.config({ path: globalConfigPath });
  } else {
    console.log("backend/config/config.env");
    dotenv.config({ path: "backend/config/config.env" });
  }
} else {
  dotenv.config({ path: ".env.production" });
}
// console.log(process.env)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: `http://localhost:${process.env.PORT}/api/auth/google/callback`, // backend port: 3001
      // callbackURL: "auth/google/callback",
      callbackURL: process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.BACKEND_URL}/api/auth/google/callback` : `${process.env.BACKEND_PROD_URL}/api/auth/google/callback`,
    },
    // function(accessToken, refreshToken, profile, done) {
    //   done(null, profile);
    // }
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Cập nhật thông tin người dùng nếu đã tồn tại
          user.googleId = profile.id;
          user.avatar = {
            public_id: "google_avatar_" + profile.id,
            url: profile.photos[0].value
          };
          await user.save();
        } else {
          // Tạo người dùng mới nếu không tồn tại
          let newUser = {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: {
              public_id: "google_avatar_" + profile.id,
              url: profile.photos[0].value
            },
            address: "Your placeholder address / Vui lòng cập nhật địa chỉ của bạn",
            phone: "+84",
            password: "Your placeholder password / Vui lòng tạo mật khẩu đăng nhập",
            method: "google"
          };
          user = await User.create(newUser);
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Cấu hình FacebookStrategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      // callbackURL: `http://localhost:${process.env.PORT}/api/auth/facebook/callback`,
      callbackURL: process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.BACKEND_URL}/api/auth/facebook/callback` : `${process.env.BACKEND_PROD_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "emails", "name"], // Yêu cầu các trường thông tin từ Facebook
      authType: 'reauthenticate', // Yêu cầu xác thực lại
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Tìm user với email:", profile.emails[0].value);
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log("Kết quả tìm User:", user);
        if (user) {
          // Cập nhật thông tin người dùng nếu đã tồn tại
          user.facebookId = profile.id;
          user.avatar = {
            public_id: "facebook_avatar_" + profile.id,
            url: `http://graph.facebook.com/${profile.id}/picture?type=large&access_token=${accessToken}`
          };
          await user.save();
        } else {
          // Tạo người dùng mới nếu không tồn tại
          console.log("Tạo user với email:", profile.emails[0].value);
          let newUser = {
            facebookId: profile.id,
            email: profile.emails[0].value,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            avatar: {
              public_id: "facebook_avatar_" + profile.id,
              url: `http://graph.facebook.com/${profile.id}/picture?type=large&access_token=${accessToken}`
            },
            address: "Your placeholder address / Vui lòng cập nhật địa chỉ của bạn",
            phone: "+84",
            password: "Your placeholder password / Vui lòng tạo mật khẩu đăng nhập",
            method: "facebook"
          };
          user = await User.create(newUser);
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize use into the session -> cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
  // done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Lấy thông tin người dùng từ DB dựa trên id
  } catch (err) {
    done(err, null);
  }
});

export default passport;
