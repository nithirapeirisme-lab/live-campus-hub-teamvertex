package com.campushub.campus_hub.entity;

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
    private String checkin_id;
    private String student_id;
    private String location_id;
    private LocalDateTime checkIn_time;
}
