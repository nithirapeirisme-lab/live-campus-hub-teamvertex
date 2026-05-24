package com.campushub.campus_hub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentDTO {
    @NotBlank(message = "Student ID cannot be blank")
    private String student_id;

    @NotBlank(message = "Password cannot be blank")
    private String student_pwd;

    @NotBlank(message = "First name cannot be blank")
    @JsonProperty("first_name")
    private String first_name;

    @NotBlank(message = "Last name cannot be blank")
    @JsonProperty("last_name")
    private String last_name;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Email cannot be blank")
    private String email;


    @NotBlank(message = "Enrolled year is required")
    @JsonProperty("enrolled_Year")
    private String enrolled_Year;

    @NotBlank(message = "Department Id cannot be blank")
    @JsonProperty("department_id")
    private String department_id;

    private BigDecimal points;
}
