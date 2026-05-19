package com.campushub.campus_hub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class RewardDTO {
    @NotBlank(message = "Reward Id cannot be blank")
    private String reward_id;

    @NotBlank(message = "Reward name cannot be blank")
    private String reward_name;

    private int reward_points;
    private int discount_percentage;
}
