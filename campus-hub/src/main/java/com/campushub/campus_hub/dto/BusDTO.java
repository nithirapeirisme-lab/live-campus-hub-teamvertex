package com.campushub.campus_hub.dto;

import com.campushub.campus_hub.enums.BusStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusDTO {
    @NotBlank(message = "Bus ID cannot be blank")
    private String bus_id;

    @NotBlank(message = "Bus number cannot be blank")
    private String busNumber;

    @NotNull(message = "Bus status cannot be blank")
    @Enumerated(EnumType.STRING)
    private BusStatus status;

    @NotBlank(message = "Bus departure location cannot be blank")
    private String departure;

    @NotBlank(message = "Bus arrival location cannot be blank")
    private String arrival;

    @NotNull(message = "departure time is required")
    private LocalDateTime departure_time;

    @NotNull(message = "arrival time is required")
    private LocalDateTime arrival_time;
}
