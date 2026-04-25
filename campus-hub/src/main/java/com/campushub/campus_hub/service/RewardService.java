package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.RewardDTO;

import java.math.BigDecimal;
import java.util.List;

public interface RewardService {
    void createReward(RewardDTO reward);
    RewardDTO getRewardDetails(String reward_id);
    List<RewardDTO> getAllRewards();
    void addPoints(String studentId, BigDecimal points);
}
