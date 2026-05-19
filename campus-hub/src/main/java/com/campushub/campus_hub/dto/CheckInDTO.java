package com.campushub.campus_hub.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class CheckInDTO {
    private String checkin_id;

    @NotBlank(message = "Student Id cannot be blank")
    private String student_id;

    @NotBlank(message = "Location Id cannot be blank")
    private String location_id;

    @NotNull(message = "Location time is required")
    private LocalDateTime checkIn_time;
}
