package com.campushub.campus_hub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentsClubDTO implements Serializable {
    @NotBlank(message = "Student Id cannot be blank")
    private String Student_id;

    @NotBlank(message = "Club Id cannot be blank")
    private String Club_id;

    @NotNull(message = "Joined date is required")
    @JsonProperty("joined_date")
    private LocalDate joined_date;

    @NotNull(message = "Active status is required")
    @JsonProperty("active_status")
    private Boolean activeStatus;
}
