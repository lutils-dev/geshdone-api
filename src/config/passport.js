import passport from "koa-passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleConfig } from "./oauth/google.js";
import { UserService } from "../services/users.service.js";

const userService = new UserService();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    googleConfig,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await userService.findByEmail(email);

        if (!user) {
          user = await userService.createUser({
            email,
            name: profile.displayName,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
