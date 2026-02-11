import {SessionStorageType} from "lib-ts-bl/dist/reducers/auth";
import LanguageEnum from "lib-ts-bl/src/constants/LanguageEnum";


function envGet() {
    // @ts-ignore
    const envObj = import.meta.env;

    // #region set environment
    let environmentName = "dev";
    let isDevelopment = false;
    let isTesting = false;
    let isProduction = false;
    switch (envObj.VITE_APP_WEBAPP_ENV) {
        case "development":
            environmentName = "dev";
            isDevelopment = true;
            break;
        case "testing":
        case "valid":
            environmentName = "test";
            isTesting = true;
            break;
        case "production":
            environmentName = "prod";
            isProduction = true;
            break;
        default:
            environmentName = "dev";
            isDevelopment = true;
            break;
    }
    // #endregion set environment

    // #region set language
    let lang = LanguageEnum.IT;
    switch (envObj.VITE_APP_WEBAPP_DEFAULT_LANG) {
        case "IT":
            lang = LanguageEnum.IT;
            break;
        case "EN":
            lang = LanguageEnum.EN;
            break;
    }
    // #endregion set language


    return {
        route: {
            baseRoute: envObj.VITE_APP_WEBAPP_ROUTE || "/", // default: /
            homePageContentCode: envObj.VITE_APP_WEBAPP_HOMEPAGE_CONTENT_CODE || "HMP", // default: HMP
        },

        environmentName: environmentName,
        isProduction: isProduction,
        isDevelopment: isDevelopment,
        isTesting: isTesting,

        defaultLang: lang, // default: it-IT
        defaultThemeColor: envObj.VITE_APP_WEBAPP_COLOR || "",
        tableElementsPerPage: parseInt(envObj.VITE_APP_WEBAPP_TABLE_ELEMENTS_PER_PAGE || "10"), // default: 10
        minDate: envObj.VITE_APP_WEBAPP_DATE_MIN || "1800-01-01", // default: 1800-01-01,

        cookie: {
            prefix: envObj.VITE_APP_WEBAPP_COOKIE_PREFIX || "",
            consentCookieName: envObj.VITE_APP_WEBAPP_COOKIE_CONSENT_NAME || "",
            storageType: envObj.VITE_APP_WEBAPP_COOKIE_STORAGE_TYPE ? envObj.VITE_APP_WEBAPP_COOKIE_STORAGE_TYPE : "LocalStorage", // default: LocalStorage
        },

        auth: {
            accessTokenName: envObj.VITE_APP_WEBAPP_ACCESS_TOKEN_NAME || "",
            refreshTokenName: envObj.VITE_APP_WEBAPP_REFRESH_TOKEN_NAME || "",
            sessionStorageType: envObj.VITE_APP_WEBAPP_SESSION_STORAGE_TYPE  ? envObj.VITE_APP_WEBAPP_SESSION_STORAGE_TYPE as SessionStorageType : "SessionStorage", // default: SessionStorage
            sessionInteractionDebounce: parseInt(envObj.VITE_APP_WEBAPP_SESSION_INTERACTION_DEBOUNCE || "3"), // default: 3
            sessionKeepDebounce: parseInt(envObj.VITE_APP_WEBAPP_SESSION_KEEP_DEBOUNCE || "60"), // default: 60
            sessionExpiringAlertAdvance: parseInt(envObj.VITE_APP_WEBAPP_SESSION_EXPIRING_ALERT_ADVANCE || "120"), // default: 120
        },
        recaptcha: {
            recaptchaV2Key: envObj.VITE_APP_WEBAPP_RECAPTCHA_V2_KEY || "",
            recaptchaV2InvisibleKey: envObj.VITE_APP_WEBAPP_RECAPTCHA_V2INVISIBLE_KEY || "",
            recaptchaV3Key: envObj.VITE_APP_WEBAPP_RECAPTCHA_V3_KEY || "",
        },

        api: {
            baseUrl: envObj.VITE_APP_API_BASE_URL || "",
            translationsUrl: envObj.VITE_APP_API_TRANSLATION_URL || "",
            correlationId: envObj.VITE_APP_API_CORRELATION_ID || "",
            applicationId: envObj.VITE_APP_API_APPLICATION_ID || "",
            tenantId: envObj.VITE_APP_API_TENANT_ID || "",
            x_api_key: envObj.VITE_APP_WEBAPP_X_API_KEY|| "",
        }
    }
}

export const environment: ReturnType<typeof envGet> = envGet();
