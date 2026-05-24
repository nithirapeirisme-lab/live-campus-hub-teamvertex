package com.campushub.campus_hub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpDTO {
    @JsonProperty("userId")
    private String userId;
    private String password;
    @JsonProperty("firstName")
    private String firstName;
    @JsonProperty("lastName")
    private String lastName;
    private String email;
    private String phone;

    @JsonProperty("enrolled_Year")
    private String enrolled_Year;

    @JsonProperty("department_id")
    private String department_id;
    private String role;
}
