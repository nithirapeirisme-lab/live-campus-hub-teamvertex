package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.StudentsClubEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentsClubDao extends JpaRepository<StudentsClubEntity,String> {
    Optional<StudentsClubEntity> findByIdStudentIdAndIdClubId(String studentId, String clubId);
}
