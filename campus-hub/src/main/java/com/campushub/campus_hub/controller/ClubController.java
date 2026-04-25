package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.ClubDTO;
import com.campushub.campus_hub.dao.ClubDao;
import com.campushub.campus_hub.exceptions.ClubNotFoundException;
import com.campushub.campus_hub.service.ClubService;
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
    private final ClubDao clubDao;

    @GetMapping
    public ResponseEntity<List<ClubDTO>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

    @PostMapping
    public ResponseEntity<String> saveClub(@RequestBody ClubDTO clubDTO){
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

    @DeleteMapping("/{clubId}")
    public ResponseEntity<Void> deleteClub(@PathVariable String clubId){
        try{
            clubService.deleteClub(clubId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(ClubNotFoundException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
