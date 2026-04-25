package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class StudentsClubId implements Serializable {

    @Column(name = "student_id")
    private String studentId;

    @Column(name = "club_id")
    private String clubId;

    public StudentsClubId() {}

    public StudentsClubId(String studentId, String clubId) {
        this.studentId = studentId;
        this.clubId = clubId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudentsClubId that = (StudentsClubId) o;
        return Objects.equals(studentId, that.studentId) &&
                Objects.equals(clubId, that.clubId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, clubId);
    }
}