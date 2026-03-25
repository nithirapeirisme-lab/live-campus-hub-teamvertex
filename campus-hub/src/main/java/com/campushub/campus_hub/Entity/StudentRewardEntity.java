package com.campushub.campus_hub.Entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "student_reward")
public class StudentRewardEntity  {
    @EmbeddedId
    private StudentRewardId id;
    private LocalDateTime earned_date;
    private int points;
}
