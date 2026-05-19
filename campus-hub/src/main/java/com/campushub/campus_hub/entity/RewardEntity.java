package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "rewards")
public class RewardEntity {
    @Id
    @Column(name = "reward_id", nullable = false)
    private String reward_id;

    @Column(name = "reward_name", nullable = false)
    private String reward_name;

    @Column(name = "reward_points", nullable = false)
    private int reward_points;

    @Column(name = "discount_percentage", nullable = false)
    private int discount_percentage;
}
