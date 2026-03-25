package com.campushub.campus_hub.Dao;

import com.campushub.campus_hub.Entity.ClubEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubDao extends JpaRepository<ClubEntity,String> {
}
