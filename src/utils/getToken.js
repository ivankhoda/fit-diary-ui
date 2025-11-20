
const getToken = () => {
    const tokenString = localStorage.getItem('token');
    console.log('Retrieved token string:', tokenString);

    if (tokenString) {
        const token = tokenString;

        return token;
    }
    return null;
};

export default getToken;
