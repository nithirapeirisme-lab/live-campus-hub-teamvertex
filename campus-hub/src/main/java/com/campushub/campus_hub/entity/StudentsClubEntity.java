package com.campushub.campus_hub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "students_club")
public class StudentsClubEntity {

    @EmbeddedId
    private StudentsClubId id = new StudentsClubId();

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id", nullable = false)
    private ClubEntity club;

    @Column(name = "joined_date", nullable = false)
    private LocalDate joinedDate;

    @Column(name = "active_status", nullable = false)
    private Boolean activeStatus;
}