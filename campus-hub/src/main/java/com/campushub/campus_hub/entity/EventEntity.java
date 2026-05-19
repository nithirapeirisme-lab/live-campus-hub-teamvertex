package com.campushub.campus_hub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "events")
public class EventEntity {
    @Id
    @Column(name = "event_id")
    private String event_id;

    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @Column(name = "event_date", nullable = false)
    private LocalDate event_date;

    @Column(name = "event_time", nullable = false)
    private LocalTime event_time;

    @Column(name = "location_name", nullable = false)
    private String location_name;

    @Column(name = "club_name", nullable = false)
    private String club_name;

}
