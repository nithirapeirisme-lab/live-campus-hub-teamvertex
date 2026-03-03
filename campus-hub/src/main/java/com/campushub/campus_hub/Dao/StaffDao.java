package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.StaffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffDao extends JpaRepository<StaffEntity,String> {
}
