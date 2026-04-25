package com.campushub.campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class CheckInDTO {
    private String checkin_id;
    private String student_id;
    private String location_id;
    private LocalDateTime checkIn_time;
}
