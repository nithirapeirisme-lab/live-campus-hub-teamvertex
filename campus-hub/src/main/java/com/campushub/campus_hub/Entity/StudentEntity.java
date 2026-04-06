package com.campushub.campus_hub.Entity;

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
    private String student_id;
    private String student_pwd;
    private String first_name;
    private String last_name;
    private String phone;
    private String email;
    private String enrolled_Year;
    private String department_id;
    private String profileImageUrl;
    private BigDecimal points;
}
