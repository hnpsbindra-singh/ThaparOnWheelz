package com.testing.springpractice.thapartyres.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcome(String toEmail, String name){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("Welcome, " + name + "!");

        mailMessage.setText(
                "Hi " + name + ",\n\n" +

                        "🚕 Welcome to Thapar On Wheels!\n\n" +

                        "Your ride across campus just got smoother.\n\n" +

                        "Your account has been successfully created and you're now part of the Thapar On Wheels network.\n\n" +

                        "Whether you're heading to COS, Library, Hostel, or racing against an 8 AM lecture clock ⏰, we've got your campus travel covered.\n\n" +

                        "Here’s what you can now do:\n" +
                        "• Book campus rides easily\n" +
                        "• Connect with verified drivers\n" +
                        "• View ride status in real time\n" +
                        "• Travel smarter across campus\n\n" +

                        "We’re excited to make campus commuting faster, safer, and more convenient for you.\n\n" +

                        "See you on the road 🚖\n\n" +

                        "— Team Thapar On Wheels"
        );

        javaMailSender.send(mailMessage);
    }
    public void sendRestotp(String toEmail, Long otp){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("Here is Your otp");
        mailMessage.setText(
                "Hi,\n\n" +

                        "Your Thapar On Wheels verification code is:\n\n" +

                        otp + "\n\n" +

                        "This OTP will expire in 5 minutes.\n\n" +

                        "If you did not request this, please ignore this email.\n\n" +

                        "— Team Thapar On Wheels 🚕"
        );

        javaMailSender.send(mailMessage);

    }
}
