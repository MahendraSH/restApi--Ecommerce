
const nodemailer= require('nodemailer')
const sendEmail = async (options)=>{
const transporter = nodemailer.createTransport({
    host: process.env.SMPT_host,
    port: process.env.SMPT_port,
    secure: true,
    service:process.env.SMPT_Service,
    auth:{
        user:process.env.SMPT_Mail,
        pass:process.env.SMPT_Password,
    },

});


    
    
    

const MailOptions={
    from:process.env.SMPT_Mail,
    to:options.email,
    subject:options.subject,
    text: options.mailMessage,
}

await transporter.sendMail(MailOptions);

}
module.exports=sendEmail;