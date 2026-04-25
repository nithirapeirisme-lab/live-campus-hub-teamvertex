package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentDao extends JpaRepository<DepartmentEntity,String> {
}
