package com.campushub.campus_hub.controller;


import com.campushub.campus_hub.dto.StaffDTO;
import com.campushub.campus_hub.exceptions.BusNotFoundException;
import com.campushub.campus_hub.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {
    private final StaffService staffService;

    @PostMapping
    public ResponseEntity<Void> saveStaffMember(@RequestBody StaffDTO staffMember) {
        staffService.saveStaffMember(staffMember);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping
    public ResponseEntity<Void> updateStaffMember(@RequestBody StaffDTO staffMember) {
        staffService.updateStaffMember(staffMember);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{staff_id}")
    public ResponseEntity<Void> deleteStaffMember(@PathVariable String staff_id) {
        try{
            staffService.deleteStaffMember(staff_id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(BusNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    @GetMapping("/{staff_id}")
    public ResponseEntity<StaffDTO> getStaff(@PathVariable String staff_id) {
        return ResponseEntity.ok(staffService.getStaffById(staff_id));
    }

    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaffs());
    }

    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file,
    Authentication authentication){
        String staffId = authentication.getName();
        String profileImageUrl = staffService.updateProfileImage(staffId, file);

        return ResponseEntity.ok(profileImageUrl);
    }


}
