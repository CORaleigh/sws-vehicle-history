import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js";

export const authenticate = () => {
    const info = new OAuthInfo({
        // Swap this ID out with registered application ID
        appId: "fvYgDp4eRMEJ6KEG",
        flowType: "auto", 
        popup: false
      });
      
      esriId.registerOAuthInfos([info]);
}
