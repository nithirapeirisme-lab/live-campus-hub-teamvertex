package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
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
    @Column(name = "location_id", nullable = false)
    private String location_id;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "capacity", nullable = false)
    private int capacity;
}
