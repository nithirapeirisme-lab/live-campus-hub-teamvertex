package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.RewardDTO;

import java.util.List;

public interface RewardService {
    void createReward(RewardDTO reward);
    void getRewardDetails(String reward_id);
    List<RewardDTO> getAllRewards();
}
