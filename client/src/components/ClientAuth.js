export function isLoggedIn()   {
    if (localStorage.getItem("loggedIn") === "1")
        return true;
    else
        return false;
}

export function saveLoginCredentials(username, displayName, accessToken)    {
    localStorage.setItem("loggedIn", "1");
    localStorage.setItem("username", username);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("accessToken", accessToken);
}

export function getDisplayName()    {
    return localStorage.getItem("username");
}

export function getAccessToken()    {
    localStorage.getItem("accessToken");
}

export function logOut()    {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("loggedIn", "0");
    localStorage.setItem("displayName", "");
}
