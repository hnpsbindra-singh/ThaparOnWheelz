package com.testing.springpractice.thapartyres.Controllers;

import com.testing.springpractice.thapartyres.DTO.RideRequestByStudent;
import com.testing.springpractice.thapartyres.DTO.RideResponseToStudent;
import com.testing.springpractice.thapartyres.DTO.RideUpload;
import com.testing.springpractice.thapartyres.Repository.RideRepo;
import com.testing.springpractice.thapartyres.Service.StudentService;
import com.testing.springpractice.thapartyres.models.Rides;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    @Autowired
    StudentService service;



    @PostMapping("/book-a-ride")
    public RideUpload booking(@RequestBody RideRequestByStudent request, @RequestParam String username ){
        return service.booking(request, username);
    }


    @GetMapping("/viewStatus/{id}")
    public RideResponseToStudent viewStatus(@PathVariable String id){
        return service.viewStatus(id);
    }

    @GetMapping("/view-all-rides")
    public List<Rides> viewAll(@RequestParam String username){
        return service.viewAll(username);
    }
}
