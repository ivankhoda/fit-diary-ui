
const getToken = () => {
    const tokenString = localStorage.getItem('token');

    if (tokenString) {
        const token = tokenString;

        return token;
    }
    return null;
};

export default getToken;
