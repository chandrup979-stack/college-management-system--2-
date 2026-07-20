const ALLOWED_EMAIL_DOMAIN = /@kprcaa\.ac\.in$/i;

const isAllowedEmailDomain = (email) => typeof email === "string" && ALLOWED_EMAIL_DOMAIN.test(email.trim());

module.exports = { isAllowedEmailDomain, ALLOWED_EMAIL_DOMAIN };
