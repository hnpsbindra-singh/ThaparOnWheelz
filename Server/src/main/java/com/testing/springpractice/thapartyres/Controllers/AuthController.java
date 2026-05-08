package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.LoginRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.Service.AuthService;
import com.testing.springpractice.thapartyres.Service.EmailService;
import com.testing.springpractice.thapartyres.DTO.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class AuthController {


    @Autowired
    AuthService authService;

    @Autowired
    EmailService mailSender;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){
        return authService.login(request);
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request){
        RegisterResponse response = authService.register(request);
        mailSender.sendWelcome(request.getUsername(), request.getName());
        return response;

    }

    @PostMapping("/send-otp")
    public String send(@RequestParam String username){
        authService.send(username);
        return "Success";
    }

    @PostMapping("/verify-otp")
    public String verify(@RequestParam String username, @RequestBody long otp) {
        String res = null;
        try {
            res = authService.verify(username, otp);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    @PostMapping("/send-reset-otp")
    public void sendResetotp(@RequestParam String username){
        try {
            authService.send(username);
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }

    @PostMapping("/reset-password")
    public void resetpassword(@RequestBody ResetPasswordRequest resetPasswordRequest){
        authService.resetPassword(resetPasswordRequest.getUsername(), resetPasswordRequest.getOTP(), resetPasswordRequest.getNewpassword());
    }


}
