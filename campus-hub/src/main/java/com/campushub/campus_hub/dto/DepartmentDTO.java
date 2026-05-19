package com.campushub.campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DepartmentDTO {
    @NotBlank(message = "Department Id cannot be blank")
    private String department_id;

    @NotBlank(message = "Department name cannot be blank")
    private String department_Name;
}
