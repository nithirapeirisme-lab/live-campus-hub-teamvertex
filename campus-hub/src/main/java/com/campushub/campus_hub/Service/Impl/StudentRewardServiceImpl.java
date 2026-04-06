package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.StudentRewardDTO;
import com.campushub.campus_hub.Dao.StudentRewardDao;
import com.campushub.campus_hub.Entity.StudentRewardEntity;
import com.campushub.campus_hub.Entity.StudentRewardId;
import com.campushub.campus_hub.Exceptions.DuplicateRewardException;
import com.campushub.campus_hub.Exceptions.RewardNotFoundException;
import com.campushub.campus_hub.Service.StudentRewardService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentRewardServiceImpl implements StudentRewardService {
    private final StudentRewardDao studentRewardDao;
    private final EntityDTOConversion entityDTOConversion;
    @Override
    public void assignRewardsToStudent(StudentRewardDTO dto) {
        checkDuplicateReward(dto.getStudent_id(), dto.getReward_id());

        if(dto.getEarned_date() == null){
            dto.setEarned_date(LocalDate.now());
        }

        studentRewardDao.save(entityDTOConversion.toStudentRewardEntity(dto));

    }

    @Override
    public void checkDuplicateReward(String studentId, String reward_Id) {
        boolean exists = studentRewardDao.existsByIdStudentIdAndIdRewardId(studentId, reward_Id);

        if(exists){
            throw new DuplicateRewardException("Student" + studentId + "has already reward " + reward_Id);
        }

    }

    @Override
    public List<StudentRewardDTO> getAllStudentRewards() {
        return entityDTOConversion.toStudentRewardDTOList(studentRewardDao.findAll());
    }

    @Override
    public void redeemDiscount(String studentId, String rewardId) {
        StudentRewardEntity record = studentRewardDao.existsByIdStudentIdAndIdRewardId(studentId, rewardId)
                ? studentRewardDao.getReferenceById(new StudentRewardId(studentId, rewardId))
                : null;
        if (record == null) {
            throw new RewardNotFoundException("Student does not have this discount unlocked.");
        }
        if (record.is_redeemed()) {
            throw new IllegalStateException("This discount has already been used!");
        }
        record.set_redeemed(true);
        record.setRedeemed_date(LocalDate.now());
        studentRewardDao.save(record);
    }
}
