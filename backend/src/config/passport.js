const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('../config/env');
const User = require('../models/User');
const Role = require('../models/Role');
const Department = require('../models/Department');
const cryptoService = require('../services/cryptoService');
const authService = require("../services/authService");
const { ACCOUNT_STATUS, ROLES } = require('../constants');
const { deriveSalt, hashPassword } = require('../crypto/hashing/academicHasher');

if (env.googleClientId && env.googleClientSecret) {
  passport.use(new GoogleStrategy({
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // If not, check if user exists with the same email
        const email = profile.emails[0].value;
        user = await authService.findUserByEmail(email);

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.accountStatus = ACCOUNT_STATUS.PENDING_OTP;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const role = await Role.findOne({ code: ROLES.USER });
        const department = await Department.findOne({}); // Default department, you might want to handle this better

        const passwordSalt = deriveSalt();
        const passwordHash = hashPassword('google-auth-placeholder', passwordSalt); // Placeholder password

        const [fullName, encryptedEmail] = await Promise.all([
          cryptoService.encryptField(profile.displayName, 'RSA', 'USER_PROFILE'),
          cryptoService.encryptField(email, 'RSA', 'USER_PROFILE')
        ]);

        const userKey = await cryptoService.getActiveKey('RSA', 'USER_PROFILE');

        user = await User.create({
          googleId: profile.id,
          fullName,
          email: encryptedEmail,
          passwordHash,
          passwordSalt,
          roleId: role._id,
          departmentId: department._id,
          accountStatus: ACCOUNT_STATUS.PENDING_OTP,
          publicKeyRef: userKey._id,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('roleId departmentId');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;