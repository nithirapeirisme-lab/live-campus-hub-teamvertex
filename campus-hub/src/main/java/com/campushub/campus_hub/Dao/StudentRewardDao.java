package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.StudentRewardEntity;
import com.campushub.campus_hub.Entity.StudentRewardId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRewardDao extends JpaRepository<StudentRewardEntity, StudentRewardId> {
    boolean existsByIdStudentIdAndIdRewardId(String studentId, String rewardId);
}
