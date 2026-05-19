package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.StudentRewardEntity;
import com.campushub.campus_hub.entity.StudentRewardId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRewardDao extends JpaRepository<StudentRewardEntity, StudentRewardId> {
    List<StudentRewardEntity> findByIdStudentId(String studentId);
    boolean existsByIdStudentIdAndIdRewardId(String studentId, String rewardId);
}
