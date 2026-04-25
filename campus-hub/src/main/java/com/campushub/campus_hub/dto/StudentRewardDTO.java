package com.campushub.campus_hub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentRewardDTO {
    private String student_id;
    private String reward_id;
    private LocalDate earned_date;
    private BigDecimal points;
}
