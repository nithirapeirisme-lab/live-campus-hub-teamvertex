package com.campushub.campus_hub.service;

import com.campushub.campus_hub.dto.StudentsClubDTO;

import java.util.List;

public interface StudentsClubService {
    void saveStudentsClub(StudentsClubDTO studentsClub);
    void updateStudentsClub(String Student_id, String Club_id);
    void deleteStudentsClub(StudentsClubDTO studentsClub);
    StudentsClubDTO joinClub(StudentsClubDTO studentsClub);
    void deactivateMembership(String student_id, String club_id);
    List<StudentsClubDTO> getStudentsClubs();
}
