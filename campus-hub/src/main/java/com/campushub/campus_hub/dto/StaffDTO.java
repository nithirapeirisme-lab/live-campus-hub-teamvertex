package com.campushub.campus_hub.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data


public class StaffDTO {
    @NotBlank(message = "Staff Id cannot be blank")
    private String staff_id;

    @NotBlank(message = "Password cannot be blank")
    private String staff_pwd;

    @NotBlank(message =  "First name cannot be blank")
    private String first_name;

    @NotBlank(message = "Last name cannot be blank")
    private String last_name;

    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotNull(message = "please choose your role")
    private Boolean is_admin;

}
