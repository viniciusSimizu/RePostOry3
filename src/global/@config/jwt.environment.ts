export const JWT_ENVIRONMENT = () => ({
  secret: process.env.SECRET,
  signOptions: { expiresIn: process.env.EXPIRES_IN },
});
