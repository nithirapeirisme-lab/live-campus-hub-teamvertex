package com.campushub.campus_hub.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "student_reward")
public class StudentRewardEntity  {
    @EmbeddedId
    private StudentRewardId id;

    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @ManyToOne
    @MapsId("rewardId")
    @JoinColumn(name = "reward_id")
    private RewardEntity reward;

    private LocalDate earned_date;

    private boolean is_redeemed = false;
    private LocalDate redeemed_date;

}
