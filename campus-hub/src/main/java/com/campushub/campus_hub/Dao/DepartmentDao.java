package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentDao extends JpaRepository<DepartmentEntity,String> {
}
