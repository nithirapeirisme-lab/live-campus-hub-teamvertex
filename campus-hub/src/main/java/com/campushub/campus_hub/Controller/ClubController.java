package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.ClubDTO;
import com.campushub.campus_hub.Service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clubs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClubController {
    private final ClubService clubService;

    @GetMapping
    public ResponseEntity<List<ClubDTO>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @PostMapping
    public ResponseEntity<Void> saveClub(@RequestBody ClubDTO clubDTO){
        clubService.saveClub(clubDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping
    public ResponseEntity<Void> updateClub(@RequestBody ClubDTO clubDTO){
        clubService.updateClub(clubDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PatchMapping
    public ResponseEntity<Void> updateClubStatus(@PathVariable String clubId, @RequestParam boolean status){
        clubService.updateClubStatus(clubId, status);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteClub(@RequestBody ClubDTO clubDTO){
        clubService.deleteClub(clubDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
