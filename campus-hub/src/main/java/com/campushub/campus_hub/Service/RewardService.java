package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.RewardDTO;

import java.math.BigDecimal;
import java.util.List;

public interface RewardService {
    void createReward(RewardDTO reward);
    RewardDTO getRewardDetails(String reward_id);
    List<RewardDTO> getAllRewards();
    void addPoints(String studentId, BigDecimal points);
}
