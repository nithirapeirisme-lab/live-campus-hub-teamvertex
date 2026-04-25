package com.campushub.campus_hub.service.impl;

import com.campushub.campus_hub.dto.StudentsClubDTO;
import com.campushub.campus_hub.dao.StudentsClubDao;
import com.campushub.campus_hub.entity.StudentsClubEntity;
import com.campushub.campus_hub.entity.StudentsClubId;
import com.campushub.campus_hub.exceptions.ResourceNotFoundException;
import com.campushub.campus_hub.exceptions.StudentClubNotFoundException;
import com.campushub.campus_hub.service.StudentsClubService;
import com.campushub.campus_hub.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public StudentsClubDTO joinClub(StudentsClubDTO studentsClub) {
        StudentsClubId id = new StudentsClubId(studentsClub.getStudent_id(), studentsClub.getClub_id());
        StudentsClubEntity registration = new StudentsClubEntity();
        registration.setId(id);
        registration.setJoined_date(LocalDate.now());
        registration.setActive_status(true);
        StudentsClubEntity savedEntry = studentsClubDao.save(registration);
        return mapToResponse(savedEntry);
    }

    @Override
    public void deactivateMembership(String student_id, String club_id) {
        StudentsClubId id = new StudentsClubId(student_id, club_id);

        StudentsClubEntity membership = studentsClubDao.findByIdStudentIdAndIdClubId(student_id, club_id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found for this Student and Club"));

        membership.setActive_status(false);
        studentsClubDao.save(membership);

    }


    @Override
    public List<StudentsClubDTO> getStudentsClubs() {
        List<StudentsClubEntity> studentsClubs = studentsClubDao.findAll();
        return entityDTOConversion.toStudentsClubDTOList(studentsClubs);
    }

    private StudentsClubDTO mapToResponse(StudentsClubEntity savedEntry) {
        StudentsClubDTO response = new StudentsClubDTO();

        response.setStudent_id(savedEntry.getStudent().getStudent_id());
        response.setClub_id(savedEntry.getClub().getClubId());

        response.setJoined_date(savedEntry.getJoined_date());
        response.setActive_status(savedEntry.getActive_status());
        return response;


    }
}
