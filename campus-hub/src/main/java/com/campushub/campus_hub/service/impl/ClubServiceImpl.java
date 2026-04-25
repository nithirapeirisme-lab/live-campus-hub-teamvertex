package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.ClubDTO;
import com.campushub.campus_hub.dao.ClubDao;
import com.campushub.campus_hub.entity.ClubEntity;
import com.campushub.campus_hub.exceptions.ClubNotFoundException;
import com.campushub.campus_hub.exceptions.DuplicateEntryException;
import com.campushub.campus_hub.service.ClubService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import com.campushub.campus_hub.util.UtilityData;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubServiceImpl implements ClubService {
    private final ClubDao clubDao;
    private final EntityDTOConversion entityDTOConversion;

    @Override
    public void saveClub(ClubDTO clubDTO) {
        if (clubDao.existsByClubName(clubDTO.getClubName())) {
            throw new DuplicateEntryException("Club with id " + clubDTO.getClubId() + " already exists!");
        }
        clubDTO.setClubId(UtilityData.generateClub_id());
        clubDao.save(entityDTOConversion.toClubEntity(clubDTO));
    }

    @Override
    public void updateClub(ClubDTO club) {
        Optional<ClubEntity> foundClub = clubDao.findById(club.getClubId());
        if(foundClub.isEmpty()){
            throw new ClubNotFoundException("Club not found with Id: "+ club.getClubId());

        }

        ClubEntity existingClub = foundClub.get();
        existingClub.setClubName(club.getClubName());
        existingClub.setStatus(club.isStatus());

        clubDao.save(existingClub);

    }

    @Override
    public void deleteClub(String clubId) {
        Optional<ClubEntity> foundClub = clubDao.findById(clubId);
        if(foundClub.isEmpty()){
            throw new ClubNotFoundException("Club not found with the ID: " + clubId);

        }
        clubDao.deleteById(clubId);

    }

    @Override
    public void updateClubStatus(String clubId, boolean status) {
        Optional<ClubEntity> foundClub = clubDao.findById(clubId);
        if(foundClub.isEmpty()){
            throw new ClubNotFoundException("Club not found with the ID: " + clubId);
        }
        ClubEntity existingClub = foundClub.get();
        existingClub.setStatus(status);

    }

    public List<ClubDTO> getAllClubs() {
        List<ClubEntity> entities = clubDao.findAll();
        return entities.stream()
                .map(entity -> entityDTOConversion.toClubDTO(entity))
                .collect(Collectors.toList());
    }
}
