package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.RewardDTO;
import com.campushub.campus_hub.DTO.StudentRewardDTO;
import com.campushub.campus_hub.Dao.RewardDao;
import com.campushub.campus_hub.Dao.StudentDao;
import com.campushub.campus_hub.Dao.StudentRewardDao;
import com.campushub.campus_hub.Entity.RewardEntity;
import com.campushub.campus_hub.Entity.StudentEntity;
import com.campushub.campus_hub.Exceptions.DuplicateRewardException;
import com.campushub.campus_hub.Exceptions.RewardNotFoundException;
import com.campushub.campus_hub.Exceptions.StudentNotFoundException;
import com.campushub.campus_hub.Service.RewardService;
import com.campushub.campus_hub.Service.StudentRewardService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import com.campushub.campus_hub.util.UtilityData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RewardServiceImpl implements RewardService {
    private final RewardDao rewardDao;
    private final EntityDTOConversion entityDTOConversion;
    private final StudentDao studentDao;
    private final StudentRewardService studentRewardService;

    @Override
    public void createReward(RewardDTO reward) {
        reward.setReward_id((UtilityData.generateReward_id()));
        rewardDao.save(entityDTOConversion.toRewardEntity(reward));

    }

    @Override
    public RewardDTO getRewardDetails(String reward_id) {
        return rewardDao.findById(reward_id)
                .map(entityDTOConversion::toRewardDTO)
                .orElseThrow(() -> new RewardNotFoundException("Reward Not Found"));
    }

    @Override
    public List<RewardDTO> getAllRewards() {
        List<RewardEntity> allRewards = rewardDao.findAll();
        return entityDTOConversion.toRewardDTOList(allRewards);
    }

    @Override
    @Transactional
    public void addPoints(String studentId, BigDecimal pointsToAdd) {
        StudentEntity student = studentDao.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException("Student Not Found"));

        BigDecimal currentBalance = (student.getPoints() == null) ? BigDecimal.ZERO : student.getPoints();
        BigDecimal newTotal = currentBalance.add(pointsToAdd);
        student.setPoints(newTotal);
        studentDao.save(student);

        if (newTotal.compareTo(new BigDecimal("1500")) >= 0) {
            assignDiscount(studentId, "DISC_15"); // 15% Discount
        } else if (newTotal.compareTo(new BigDecimal("1000")) >= 0) {
            assignDiscount(studentId, "DISC_10"); // 10% Discount
        } else if (newTotal.compareTo(new BigDecimal("500")) >= 0) {
            assignDiscount(studentId, "DISC_5");  // 5% Discount
        }
    }

    private void assignDiscount(String studentId, String rewardId) {
        try {
            StudentRewardDTO dto = new StudentRewardDTO();
            dto.setStudent_id(studentId);
            dto.setReward_id(rewardId);
            dto.setEarned_date(LocalDate.now());
            studentRewardService.assignRewardsToStudent(dto);
        } catch (DuplicateRewardException e) {
            throw new RuntimeException(e);
        }
    }


}
