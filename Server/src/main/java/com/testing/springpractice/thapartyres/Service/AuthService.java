package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.LoginRequest;
import com.testing.springpractice.thapartyres.DTO.LoginResponse;
import com.testing.springpractice.thapartyres.DTO.RegisterRequest;
import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.Security.JwtUtils;
import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthService {
    @Autowired
    UserRepo repo;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService service;

    public String login(LoginRequest request) {
        String token;
        try{
            Authenticate(request.getUsername(), request.getPassword());
        } catch (Exception e) {
            e.printStackTrace();
            return "Invalid Request";
        }
        Users user = repo.findByUsername(request.getUsername());
        if(user == null){
            return "User not found";
        }
        if(!user.isVerified()){
            return "User NOT VERIFIED, Kindly verify";
        }
        return jwtUtils.generateToken(user.getUsername(), user.getRole());

    }
    public void Authenticate(String username, String password){
        authenticationManager
                .authenticate(
                        new UsernamePasswordAuthenticationToken
                                (username, password));
    }


    public RegisterResponse register(RegisterRequest request) {
        Users user = new Users();
        user.setName(request.getName());
        user.setNumber(request.getNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setUsername(request.getUsername());
        if(request.getRole().name().equals("DRIVER")){
            user.setVehicleNumber(request.getVehicleNumber());
        }
        if(request.getRole().name().equals("STUDENT")){
            user.setRollNumber(request.getRollNumber());
        }
        repo.save(user);
        return maptores(user);
    }

    public RegisterResponse maptores(Users user){

        RegisterResponse response = new RegisterResponse();

        response.setRole(user.getRole());
        response.setName(user.getName());
        response.setNumber(user.getNumber());
        response.setUsername(user.getUsername());

        if(user.getRole() == Role.DRIVER){
            response.setVehicleNumber(user.getVehicleNumber());
        }

        if(user.getRole() == Role.STUDENT){
            response.setRollNumber(user.getRollNumber());
        }

        return response;
    }

    public Long send(String username) {
        Random random = new Random();

        long otp = 100000 + random.nextInt(900000);
        Users users = repo.findByUsername(username);

        users.setOtp(otp);
        long expry = System.currentTimeMillis() + (15*60*1000);
        users.setOtpExpiredAt(expry);
        repo.save(users);

        try{
            service.sendRestotp(username, otp);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return otp;


    }

    public String verify(String username, long otp) {
        Users us = repo.findByUsername(username);

        if(us == null){
            return "User not found";
        }

        if(us.isVerified()){
            return "Already verified";
        }

        if(us.getOtp() == null){
            return "No OTP generated";
        }

        // check expiry
        if(us.getOtpExpiredAt() < System.currentTimeMillis()){
            return "OTP expired";
        }

        // check match
        if(!us.getOtp().equals(otp)){
            return "Invalid OTP";
        }

        // success
        us.setVerified(true);
        us.setOtp(null);
        us.setOtpExpiredAt(0L);

        repo.save(us);

        return "User verified successfully";
    }

    public void resetPassword(String username, long otp, String newpassword) {
        Users us = repo.findByUsername(username);
        if(us == null){
            throw new RuntimeException(
                    "User not found"
            );
        }
        if(us.getOtp()==null||!us.getOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }
        if(us.getOtpExpiredAt()<System.currentTimeMillis()){
            throw new RuntimeException("OTP expired");
        }
        us.setPassword(passwordEncoder.encode(newpassword));
        us.setOtp(null);

        repo.save(us);
    }
}
