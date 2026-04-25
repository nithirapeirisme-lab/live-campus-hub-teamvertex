package com.campushub.campus_hub.dao;

import com.campushub.campus_hub.entity.RewardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardDao extends JpaRepository<RewardEntity,String> {
}
