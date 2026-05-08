package com.testing.springpractice.thapartyres.Service;

import com.testing.springpractice.thapartyres.DTO.RideRequestByStudent;
import com.testing.springpractice.thapartyres.DTO.RideResponseToStudent;
import com.testing.springpractice.thapartyres.DTO.RideUpload;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Repository.UserRepo;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    UserRepo repo;

    @Autowired
    RideRepo rideRepo;
    public RideUpload booking(RideRequestByStudent request, String username) {
        Rides rides = new Rides();
        Users users = repo.findByUsername(username);
        rides.setUserId(users.getId());
        rides.setPickUp(request.getPickUp());
        rides.setDrop(request.getDrop());

        rideRepo.save(rides);

        return maptores(rides);
    }

    private RideUpload maptores(Rides rides) {
        RideUpload rideUpload = new RideUpload();
        rideUpload.setPickUp(rides.getPickUp());
        rideUpload.setDrop(rides.getDrop());
        rideUpload.setBookingid(rides.getId());

        return rideUpload;
    }

    public RideResponseToStudent viewStatus(String id) {
        Rides ride = rideRepo.findById(id).orElse(null);



        if(ride == null){
            throw new RuntimeException("Invalid Ride");
        }
        if(ride.getDriverId() == null){

            RideResponseToStudent response =
                    new RideResponseToStudent();

            response.setPickUp(ride.getPickUp());

            response.setDrop(ride.getDrop());

            return response;
        }

        return maptoresponse(ride);
    }

    private RideResponseToStudent maptoresponse(Rides ride) {
        RideResponseToStudent response =
                new RideResponseToStudent();

        Users driver = repo.findById(ride.getDriverId()).orElse(null);

        if(driver==null){
            throw new RuntimeException("Invalid driver");
        }

        response.setName(driver.getName());

        response.setNumber(driver.getNumber());

        response.setVehicleNumber(
                driver.getVehicleNumber());

        response.setPickUp(ride.getPickUp());

        response.setDrop(ride.getDrop());

        return response;
    }

    public List<Rides> viewAll(String username) {
        Users users = repo.findByUsername(username);
        if(users == null){
            throw new RuntimeException("Invalid user");
        }
        return rideRepo.findByUserId(users.getId());


    }
}
