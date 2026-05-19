package com.campushub.campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentRewardDTO {
    @NotBlank(message = "Student Id cannot be blank")
    private String student_id;

    @NotBlank(message = "Rewards Id cannot be blank")
    private String reward_id;

    @NotNull(message = "Earned date is required")
    private LocalDate earned_date;

    private BigDecimal points;
}
