package com.campushub.campus_hub.Controller;


import com.campushub.campus_hub.DTO.StaffDTO;
import com.campushub.campus_hub.Service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping
    public ResponseEntity<Void> deleteStaffMember(@RequestBody StaffDTO staffMember) {
        staffService.deleteStaffMember(staffMember.getStaff_id());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{staff_id}")
    public ResponseEntity<StaffDTO> getStaff(@PathVariable String staff_id) {
        return ResponseEntity.ok(staffService.getStaffById(staff_id));
    }

    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaffs());
    }


}
