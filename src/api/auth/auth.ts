import axiosInstances from "@/config/axios";

const requestAuth = axiosInstances.auth
const ROOT_AUTH ="/auth"

const updateAccount = (id: string,
name: string,
phoneNumber: string,
address: string) => requestAuth.put(`${ROOT_AUTH}/UpdateAccount`, {id: id,
name: name,
phoneNumber: phoneNumber,
address: address})

const ConfirmEmail = (email: string,
token: string,) => requestAuth.get(`${ROOT_AUTH}/ConfirmEmail`, {params:{email: email,
token: token}})

const sendEmailForgotPassword = (email: string) => requestAuth.post(`${ROOT_AUTH}/SendEmailForgotPassword?email=${email}`);

const changePasswordWithoutOldPass = (email: string,
    newpass: string, code: string) => requestAuth.post(`${ROOT_AUTH}/ChangePasswordWithoutOldPass?email=${email}&newpass=${newpass}&code=${code}`);
    
const getUserInfo = (userId: string) => requestAuth.post(`${ROOT_AUTH}/GetUserInfo?userID=${userId}`);

const changePasswordWithOldPass = (code: string,
email: string,
oldPassword: string,
newPassword: string) => requestAuth.post(`${ROOT_AUTH}/ChangePasswordWithOldPass`,{
code,
email,
oldPassword,
newPassword
});

const authApi = {
    updateAccount,
    ConfirmEmail,
    sendEmailForgotPassword,
    changePasswordWithoutOldPass,
    changePasswordWithOldPass,
    getUserInfo
};
  
export default authApi;