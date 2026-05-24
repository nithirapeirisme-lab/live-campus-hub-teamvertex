package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.StudentsClubDTO;
import com.campushub.campus_hub.service.StudentsClubService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students_club")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentsClubController {
    private final StudentsClubService studentsClubService;

    // Admin logs a student into a club via this method (Uses data inside payload body)
    @PostMapping("/join-auth")
    public ResponseEntity<Void> joinClub(@Valid @RequestBody StudentsClubDTO studentsClubDTO){
        // FIX: Removed casting and stopped overwriting student_id with admin credentials
        studentsClubService.saveStudentsClub(studentsClubDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<StudentsClubDTO>> getStudentsClubs() {
        return ResponseEntity.ok(studentsClubService.getStudentsClubs());
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveClub(@Valid @RequestBody StudentsClubDTO studentsClubDTO, Authentication authentication){
        // Automatically tie the action to whoever is logged in to securely leave a club
        studentsClubDTO.setStudent_id(authentication.getName());
        studentsClubService.deleteStudentsClub(studentsClubDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Students use this endpoint to register themselves safely
    @PostMapping("/join")
    public ResponseEntity<StudentsClubDTO> join(@Valid @RequestBody StudentsClubDTO request, Authentication authentication) {
        // FIX: Added security check to make sure students can only join clubs as themselves
        request.setStudent_id(authentication.getName());
        return ResponseEntity.ok(studentsClubService.joinClub(request));
    }

    @PatchMapping("/{student_id}/{club_id}/deactivate")
    public ResponseEntity<Void> deactivate(
            @PathVariable String student_id,
            @PathVariable String club_id) {

        studentsClubService.deactivateMembership(student_id, club_id);
        return ResponseEntity.noContent().build();
    }
}