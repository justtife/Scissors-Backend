const mainConfig: { [key: string]: any } = {
  development: {
    PORT: (process.env.APP_PORT || 7789) as number,
    DB_URI: process.env.DB_URI as string,
    COOKIE_SECRET: process.env.COOKIE_SECRET as string,
    SESSION_SECRET: process.env.SESSION_SECRET as string,
    SESSION_NAME: process.env.SESSION_NAME as string,
    CLOUD_NAME: process.env.CLOUD_NAME as string,
    API_KEY: process.env.API_KEY as string,
    API_SECRET: process.env.API_SECRET as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    APP_LINK: `http://localhost:${process.env.APP_PORT}`,
    LOCATION_KEY: process.env.LOCATION_KEY,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: (process.env.REDIS_PORT || 6379) as number,
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_SECRET: process.env.CLIENT_SECRET as string,
    CALLBACK_URL: process.env.CALLBACK_URL as string,
  },
  production: {},
  test: {},
};

export { mainConfig };
