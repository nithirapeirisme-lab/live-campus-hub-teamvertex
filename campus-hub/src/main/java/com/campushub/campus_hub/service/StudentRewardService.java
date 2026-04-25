package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.StudentRewardDTO;

import java.util.List;

public interface StudentRewardService {
    void assignRewardsToStudent(StudentRewardDTO dto);
    void checkDuplicateReward(String studentId, String reward_Id);
    List<StudentRewardDTO> getAllStudentRewards();
    void redeemDiscount(String studentId, String rewardId);

}
