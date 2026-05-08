package com.testing.springpractice.thapartyres.Repository;

import com.testing.springpractice.thapartyres.models.Role;
import com.testing.springpractice.thapartyres.models.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {
    Users findByid(String id);

    Users findByUsername(String username);

    long countByRole(Role role);

    List<Users> findByRole(Role role);
}
