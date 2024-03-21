export const setLocalStorage = (name, value) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(name, value);
    } else {
      console.error("localStorage is not available.");
    }
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};

export const getLocalStorage = (name) => {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(name);
    } else {
      console.error("localStorage is not available.");
      return null;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

export const setUserInfo = (userInfo) => {
  setLocalStorage(
    "USER_INFO",
    JSON.stringify({
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      role: userInfo.role,
      address: userInfo.address,
    })
  );
};

export const getUserInfo = () => {
  return getLocalStorage("USER_INFO");
};

export const getUserInfoId = () => {
  var userInfoString = getUserInfo();
  var userInfo = JSON.parse(userInfoString);
  return userInfo && userInfo.id ? userInfo.id : null;
};
