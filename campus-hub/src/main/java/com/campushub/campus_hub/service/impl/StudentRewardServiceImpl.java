package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dao.RewardDao;
import com.campushub.campus_hub.dao.StudentDao;
import com.campushub.campus_hub.dto.StudentRewardDTO;
import com.campushub.campus_hub.dao.StudentRewardDao;
import com.campushub.campus_hub.entity.RewardEntity;
import com.campushub.campus_hub.entity.StudentEntity;
import com.campushub.campus_hub.entity.StudentRewardEntity;
import com.campushub.campus_hub.entity.StudentRewardId;
import com.campushub.campus_hub.exceptions.DuplicateRewardException;
import com.campushub.campus_hub.exceptions.ResourceNotFoundException;
import com.campushub.campus_hub.exceptions.RewardNotFoundException;
import com.campushub.campus_hub.service.StudentRewardService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentRewardServiceImpl implements StudentRewardService {
    private final StudentRewardDao studentRewardDao;
    private final RewardDao rewardDao;
    private final ModelMapper modelMapper;
    private final StudentDao studentDao;
    private final EntityDTOConversion entityDTOConversion;


    @Override
    public StudentRewardDTO assignRewardsToStudent(StudentRewardDTO dto) {
        StudentRewardEntity entity = modelMapper.map(dto, StudentRewardEntity.class);
        RewardEntity reward = rewardDao.findById(dto.getReward_id()).orElseThrow(() -> new ResourceNotFoundException("Reward not found"));
        StudentEntity student = studentDao.findById(dto.getStudent_id())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        StudentRewardId id = new StudentRewardId(student.getStudent_id(), reward.getReward_id());
        entity.setId(id);
        entity.setStudent(student);
        entity.setReward(reward);
        StudentRewardEntity savedEntity = studentRewardDao.save(entity);
        return modelMapper.map(savedEntity, StudentRewardDTO.class);
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
