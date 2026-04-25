package com.campushub.campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventDTO {
    private String event_id;
    private String eventTitle;
    private LocalDate event_date;
    private LocalTime event_time;
    private String location_id;
    private String club_id;
}
