package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.StudentRewardEntity;
import com.campushub.campus_hub.entity.StudentRewardId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRewardDao extends JpaRepository<StudentRewardEntity, StudentRewardId> {
    boolean existsByIdStudentIdAndIdRewardId(String studentId, String rewardId);
}
