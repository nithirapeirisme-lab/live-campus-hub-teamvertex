package com.campushub.campus_hub.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "location")
public class LocationEntity {
    @Id
    private String location_id;
    private String location_name;
    private int capacity;
}
