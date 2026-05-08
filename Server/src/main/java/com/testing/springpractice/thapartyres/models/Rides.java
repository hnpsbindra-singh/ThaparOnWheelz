package com.testing.springpractice.thapartyres.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "rides")
public class Rides {
    @Id
    private String id;
    @Indexed
    private String userId;
    @Indexed
    private String driverId;
    private Location pickUp;
    private Location drop;
}
