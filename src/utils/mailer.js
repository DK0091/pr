import nodemailer from "nodemailer"


export const sendmail = async({to,subject,text,html})=>{
    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.MY_GMAIL,
            pass : process.env.MY_GMAIL_PASS
        }
    });

    await transporter.sendMail({
        from:`"E-COMMERCE" <${process.env.MY_GMAIL}>`,
        to,
        subject,
        text,
        html
    });
}

