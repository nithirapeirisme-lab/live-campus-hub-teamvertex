package com.campushub.campus_hub.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
