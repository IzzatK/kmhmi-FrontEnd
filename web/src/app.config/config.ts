

export const KM_API_SERVER_URL = process.env.REACT_APP_SERVER_URL;


export const keycloakEnabled = process.env.REACT_APP_USE_KEYCLOAK === 'true';



// export default {
//     protocol:LocalService.initValue(CONFIGURATION.protocol, window.location.protocol.replace(':','')),
//     ip:LocalService.initValue(CONFIGURATION.ip, window.location.hostname),
//     port:LocalService.initValue(CONFIGURATION.port, 4567),
//     webservice:LocalService.initValue(CONFIGURATION.webservice, ""),
//     user: "",
//     loginOpen: true,
//     debug:true,
// }

export const KC_REALM = `${process.env.REACT_APP_KEYCLOAK_REALM}`;

export const keycloakConfig = {
    "realm": KC_REALM,
    "auth-server-url": "https://auth.navyanalytics.com/auth/",
    "always-refresh-token": true,
    "ssl-required": "external",
    "resource": "navyanalytics-www",
    "public-client": true,
    "confidential-port": 0,
    "clientId": 'navyanalytics-www'
}

export default {
    // protocol:LocalService.initValue(CONFIGURATION.protocol, 'https'),//window.location.protocol),
    // ip:LocalService.initValue(CONFIGURATION.ip, window.location.hostname),
    // port:LocalService.initValue(CONFIGURATION.port, 44312),
    // webservice:LocalService.initValue(CONFIGURATION.webservice, ""),
    // user: "",
    // loginOpen: true,
    // debug:true,
}



//44312
//4567
