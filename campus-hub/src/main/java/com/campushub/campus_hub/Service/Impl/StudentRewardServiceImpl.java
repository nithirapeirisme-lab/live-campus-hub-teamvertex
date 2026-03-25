package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.StudentRewardDTO;
import com.campushub.campus_hub.Dao.StudentRewardDao;
import com.campushub.campus_hub.Exceptions.DuplicateRewardException;
import com.campushub.campus_hub.Service.StudentRewardService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
            dto.setEarned_date(LocalDateTime.now());
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
}
