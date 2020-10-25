export function isLoggedIn()   {
    if (localStorage.getItem("loggedIn") === "1")
        return true;
    else
        return false;
}

export function saveLoginCredentials(username, displayName, accessToken, isPetOwner, isCareTaker, isAdmin)    {
    localStorage.setItem("loggedIn", "1");
    localStorage.setItem("username", username);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("isPetOwner", isPetOwner);
    localStorage.setItem("isCareTaker", isCareTaker);
    localStorage.setItem("isAdmin", isAdmin);
}

export function getDisplayName()    {
    return localStorage.getItem("username");
}

export function getAccessToken()    {
    return localStorage.getItem("accessToken");
}

export function isPetOwner()    {
    return localStorage.getItem("isPetOwner") === "true";
}
export function isCareTaker()    {
    return localStorage.getItem("isCareTaker") === "true";
}
export function isAdmin()    {
    return localStorage.getItem("isAdmin") === "true";
}

export function logOut()    {
    localStorage.setItem("accessToken", "");
    localStorage.setItem("loggedIn", "0");
    localStorage.setItem("displayName", "");
}
