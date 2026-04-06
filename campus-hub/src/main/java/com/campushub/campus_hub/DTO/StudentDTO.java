package com.campushub.campus_hub.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentDTO {
    private String student_id;
    private String student_pwd;
    private String first_name;
    private String last_name;
    private String phone;
    private String email;
    private String enrolled_Year;
    private String department_id;
    private BigDecimal points;
}
