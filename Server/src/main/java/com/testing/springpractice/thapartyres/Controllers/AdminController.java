package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.RegisterResponse;
import com.testing.springpractice.thapartyres.Service.AdminService;
import com.testing.springpractice.thapartyres.models.Rides;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    AdminService service;
    @GetMapping("/total-drivers")
    public long totalDrivers(){
        return service.totalDrivers();
    }
    @GetMapping("/total-students")
    public long totalStudents(){
        return service.totalStudents();
    }
    @GetMapping("/get-all")
    public List<Rides> getall(){
        return service.findAll();
    }
    @GetMapping("/view-all-drivers")
    public List<RegisterResponse> getDrivers(){
        return service.allDrivers();

    }
    @GetMapping("/view-all-students")
    public List<RegisterResponse> getStudents(){
        return service.allStudents();

    }
}
