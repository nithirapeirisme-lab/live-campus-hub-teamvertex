package com.campushub.campus_hub.Service;

import com.campushub.campus_hub.DTO.ClubDTO;

import java.util.List;

public interface ClubService {
    void saveClub(ClubDTO club);
    void updateClub(ClubDTO club);
    void deleteClub(ClubDTO club);
    void updateClubStatus(String clubId, boolean status);
    List<ClubDTO> getAllClubs();


}
