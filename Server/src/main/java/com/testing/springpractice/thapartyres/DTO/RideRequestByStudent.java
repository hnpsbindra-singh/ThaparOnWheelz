package com.testing.springpractice.thapartyres.DTO;


import com.testing.springpractice.thapartyres.models.Location;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideRequestByStudent {
    private Location pickUp;
    private Location drop;
}
