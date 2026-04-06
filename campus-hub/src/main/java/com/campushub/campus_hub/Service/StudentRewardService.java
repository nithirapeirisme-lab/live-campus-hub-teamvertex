package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.StudentRewardDTO;

import java.util.List;

public interface StudentRewardService {
    void assignRewardsToStudent(StudentRewardDTO dto);
    void checkDuplicateReward(String studentId, String reward_Id);
    List<StudentRewardDTO> getAllStudentRewards();
    void redeemDiscount(String studentId, String rewardId);

}
