package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.RewardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardDao extends JpaRepository<RewardEntity,String> {
}
