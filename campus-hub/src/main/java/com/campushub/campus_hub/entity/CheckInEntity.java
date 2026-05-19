package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "check_in")
public class CheckInEntity {
    @Id
    @Column(name = "checkin_id", nullable = false)
    private String checkin_id;

    @Column(name = "student_id", nullable = false)
    private String student_id;

    @Column(name = "location_id", nullable = false)
    private String location_id;

    @Column(name = "checkIn_time", nullable = false)
    private LocalDateTime checkIn_time;
}
