package com.campushub.campus_hub.entity;

import com.campushub.campus_hub.enums.BusStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "bus")
public class BusEntity {
    @Id
    @Column(name = "bus_id", nullable = false)
    private String bus_id;

    @Column(name = "bus_number", nullable = false)
    private String busNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BusStatus status;

    @Column(name = "departure", nullable = false)
    private String departure;

    @Column(name = "arrival", nullable = false)
    private String arrival;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departure_time;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrival_time;
}
