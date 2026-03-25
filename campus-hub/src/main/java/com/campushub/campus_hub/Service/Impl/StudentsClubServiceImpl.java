package com.campushub.campus_hub.Service.Impl;

import com.campushub.campus_hub.DTO.StudentsClubDTO;
import com.campushub.campus_hub.Dao.StudentsClubDao;
import com.campushub.campus_hub.Entity.StudentsClubEntity;
import com.campushub.campus_hub.Entity.StudentsClubId;
import com.campushub.campus_hub.Exceptions.StudentClubNotFoundException;
import com.campushub.campus_hub.Service.StudentsClubService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentsClubServiceImpl implements StudentsClubService {
    private final StudentsClubDao studentsClubDao;
    private final EntityDTOConversion entityDTOConversion;

    @Override
    public void saveStudentsClub(StudentsClubDTO studentsClub) {
        studentsClubDao.save(entityDTOConversion.toStudentsClubEntity(studentsClub));

    }

    @Override
    public void updateStudentsClub(String studentId, String ClubId) {
        Optional<StudentsClubEntity> sClubs = studentsClubDao.findByIdStudentIdAndIdClubId(studentId, ClubId );
        if(!sClubs.isPresent()) {
            throw new StudentClubNotFoundException("Student's club not found.");
        }
        sClubs.get().setId(new StudentsClubId());

    }

    @Override
    public void deleteStudentsClub(StudentsClubDTO studentsClub) {
        Optional<StudentsClubEntity> sClubs = studentsClubDao.findByIdStudentIdAndIdClubId(studentsClub.getStudent_id(), studentsClub.getClub_id());
        if(!sClubs.isPresent()) {
            throw new StudentClubNotFoundException("Student's club not found.");
        }
        studentsClubDao.delete(sClubs.get());

    }

    @Override
    public List<StudentsClubDTO> getStudentsClubs() {
        List<StudentsClubEntity> studentsClubs = studentsClubDao.findAll();
        return entityDTOConversion.toStudentsClubDTOList(studentsClubs);
    }
}
