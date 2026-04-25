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
    private StudentsClubId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id")
    private ClubEntity club;

    private LocalDate joined_date;
    private Boolean active_status;

}
