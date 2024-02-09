export const getCurrentUserUsername = () => {
  return cy
    .request("/api/me?fields=userCredentials[username]")
    .then((response) => {
      return response.body.userCredentials.username;
    });
};
