package com.campushub.campus_hub.dto;

import com.campushub.campus_hub.enums.BusStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusDTO {
    private String bus_id;
    private String busNumber;
    @Enumerated(EnumType.STRING)
    private BusStatus status;
    private String departure;
    private String arrival;
    private LocalDateTime departure_time;
    private LocalDateTime arrival_time;
}
