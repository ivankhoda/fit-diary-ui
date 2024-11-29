
const getToken = () => {
    const tokenString = sessionStorage.getItem('token');

    if (tokenString) {
        const token = JSON.parse(tokenString);

        return token;
    }
    return null;
};

export default getToken;
