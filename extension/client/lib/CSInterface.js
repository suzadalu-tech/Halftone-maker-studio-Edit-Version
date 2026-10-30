/**
 * CSInterface - v9.4.0
 * Adobe CEP interface library for communication between CEP panel and Illustrator ExtendScript
 */
function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.evalScript(script, callback);
    } else {
        console.warn("[CSInterface mock] evalScript:", script);
        if (callback) {
            callback(JSON.stringify({ success: true, message: "Browser simulation mode" }));
        }
    }
};

CSInterface.prototype.getHostEnvironment = function() {
    if (window.__adobe_cep__) {
        var str = window.__adobe_cep__.getHostEnvironment();
        return JSON.parse(str);
    }
    return {
        appName: "ILST",
        appVersion: "28.0.0",
        appLocale: "en_US",
        appUILocale: "en_US",
        appId: "ILST",
        isAppOnline: true
    };
};

CSInterface.prototype.closeExtension = function() {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.closeExtension();
    }
};

CSInterface.prototype.addEventListener = function(type, listener, obj) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.addEventListener(type, listener, obj);
    }
};

CSInterface.prototype.dispatchEvent = function(event) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.dispatchEvent(event);
    }
};

CSInterface.prototype.openURLInDefaultBrowser = function(url) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.openURLInDefaultBrowser(url);
    } else {
        window.open(url, "_blank");
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSInterface;
}
