package com.testing.springpractice.thapartyres.Repository;

import com.testing.springpractice.thapartyres.models.Rides;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepo extends MongoRepository<Rides, String> {

    List<Rides> findByUserId(String userId);
    List<Rides> findByDriverId(String driverId);
    List<Rides> findByDriverIdIsNull();
}
