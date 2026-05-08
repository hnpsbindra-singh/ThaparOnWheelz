package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.DriverRideResponse;
import com.testing.springpractice.thapartyres.Service.DriverService;
import com.testing.springpractice.thapartyres.models.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
public class DriverController {
    @Autowired
    DriverService service;

    @GetMapping("/view-all-pending")
    public List<Rides> viewAll(){
        return service.viewAll();
    }

    @PutMapping("/accept-ride/{id}")
    public DriverRideResponse accept(@PathVariable String id, @RequestParam String username){
        return service.accept(id, username);
    }

    @GetMapping("/view-history")
    public List<Rides> viewhistory(@RequestParam String username){
        return service.viewhistory(username);
    }

}
