package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentDao extends JpaRepository<StudentEntity,String> {
}
