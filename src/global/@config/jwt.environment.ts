export const JWT_ENVIRONMENT = () => ({
  secret: process.env.SECRET,
  signOptions: { expiresIn: process.env.EXPIRES_IN },
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
});
