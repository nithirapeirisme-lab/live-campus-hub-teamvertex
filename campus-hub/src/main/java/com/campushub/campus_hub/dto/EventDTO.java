package com.campushub.campus_hub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Event title cannot be blank")
    @JsonProperty("eventTitle")
    private String eventTitle;

    @NotNull(message = "Event date is required")
    private LocalDate event_date;

    @NotNull(message = "Event time is required")
    private LocalTime event_time;

    @NotBlank(message = "Location name cannot be blank")
    private String location_name;

    @NotBlank(message = "Club name cannot be blank")
    private String club_name;
}
