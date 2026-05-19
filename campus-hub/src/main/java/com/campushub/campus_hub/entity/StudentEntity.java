package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "students")
public class StudentEntity {
    @Id
    @Column(name = "student_id", nullable = false)
    private String student_id;

    @Column(name = "student_pwd", nullable = false)
    private String student_pwd;

    @Column(name = "first_name", nullable = false)
    private String first_name;

    @Column(name = "last_name", nullable = false)
    private String last_name;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "enrolled_Year", nullable = false)
    private String enrolled_Year;

    @Column(name = "department_id", nullable = false)
    private String department_id;

    private String profileImageUrl;
    @Column(name = "points")
    public BigDecimal points = BigDecimal.ZERO;
}
