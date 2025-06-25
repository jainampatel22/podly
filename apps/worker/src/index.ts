import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
const app = express()
app.use(cors())
app.use(bodyParser.json())
dotenv.config()
app.post('/send-mail',async(req,res)=>{
    const {name,email,subject,date,time}=req.body
    try {
        const transporter= nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })
    const mailOptions = {
        from:process.env.EMAIL,
        to:email,
        subject:subject,
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
    <h2 style="color: #2c3e50;">Hello ${name},</h2>

    <p style="font-size: 16px; color: #333;">
      You have been <strong>selected for a scheduled call</strong> on <strong>${date}</strong> at <strong>${time}</strong>.
    </p>

    <p style="font-size: 16px; color: #333;">
      This call has been initiated through <strong>Podler</strong>, your trusted platform for connecting professionals effectively and meaningfully.
    </p>

    <p style="font-size: 16px; color: #333;">
      Please ensure you're available at the scheduled time. If you need to reschedule or have any questions, feel free to reach out in advance.
    </p>

    <p style="font-size: 16px; color: #333;">
      Thank you for choosing Podler.
    </p>

    <p style="font-size: 16px; color: #2c3e50; font-weight: bold;">
      — The Podler Team
    </p>

    <hr style="margin: 30px 0;" />
    <footer style="font-size: 12px; color: #888;">
      Podler Inc. | Connecting Professionals<br/>
      <a href="https://podler.com" style="color: #888;">www.podler.com</a>
    </footer>
  </div>
`

        
    }
    await transporter.sendMail(mailOptions)
    res.status(200).send({ success: true, message: 'Email sent successfully!' });

    } catch (error) {
        console.error(error);
    res.status(500).send({ success: false, message: 'Email failed to send.' });

    }
})

app.listen(5050, () => {
    console.log('Worker is running on port 3000')
})