package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentDao extends JpaRepository<StudentEntity,String> {
}
