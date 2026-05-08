package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {
    @Autowired
    RideRepo rideRepo;
    @Autowired
    UserRepo userRepo;
    public List<Rides> viewAll() {
        return rideRepo.findByDriverIdIsNull();
    }

    public DriverRideResponse accept(String id, String username) {
        Rides rides = rideRepo.findById(id).orElse(null);
        if (rides==null)
        {
            throw new RuntimeException("Ride not exist");
        }

        if(rides.getDriverId() != null){
            throw new RuntimeException("Ride already accepted");
        }
        String userId = rides.getUserId();
        Users users = userRepo.findById(userId).orElse(null);
        if(users == null){
            throw new RuntimeException("Student not found");
        }
        DriverRideResponse driverRideResponse = new DriverRideResponse();
        driverRideResponse.setName(users.getName());
        driverRideResponse.setNumber(users.getNumber());
        driverRideResponse.setDrop(rides.getDrop());
        driverRideResponse.setPickUp(rides.getPickUp());

        Users Driver = userRepo.findByUsername(username);
        if(Driver == null){
            throw new RuntimeException(
                    "Driver not found"
            );
        }

        rides.setDriverId(Driver.getId());
        rideRepo.save(rides);

        return driverRideResponse;

    }

    public List<Rides> viewhistory(String username) {
        Users user = userRepo.findByUsername(username);
        if(user == null){
            throw new RuntimeException("Invalid driver");
        }
        return rideRepo.findByDriverId(user.getId());
    }
}
