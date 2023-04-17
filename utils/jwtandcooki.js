// create jwt token and send it in cooki 

const sendjwtTokenSendCooki = async (user, statusCode, res) => {


    const loginToken = await user.generateWebToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.Cookie_Expire * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,

    };
    res.status(200).cookie("loginToken", loginToken, options).json({
        success: true,
        user,
        loginToken,
    })
}
module.exports = sendjwtTokenSendCooki;