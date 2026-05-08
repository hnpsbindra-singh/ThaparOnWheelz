package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    @Autowired
    UserRepo userRepo;

    @Autowired
    RideRepo rideRepo;
    public long totalDrivers(){
        return userRepo.countByRole(Role.DRIVER);
    }

    public long totalStudents() {
        return userRepo.countByRole(Role.STUDENT);
    }

    public List<Rides> findAll() {
        return rideRepo.findAll();
    }

    public List<RegisterResponse> allDrivers() {
        List<Users> all= userRepo.findByRole(Role.DRIVER);
        List<RegisterResponse> res = new ArrayList<>();
        for (int i = 0; i < all.size(); i++) {
            res.add(maptores(all.get(i)));

        }
        return res;
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

    public List<RegisterResponse> allStudents() {
        List<Users> all= userRepo.findByRole(Role.STUDENT);
        List<RegisterResponse> res = new ArrayList<>();
        for (int i = 0; i < all.size(); i++) {
            res.add(maptores(all.get(i)));

        }
        return res;
    }
}
