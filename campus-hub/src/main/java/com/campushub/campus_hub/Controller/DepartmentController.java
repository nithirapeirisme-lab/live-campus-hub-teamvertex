package com.campushub.campus_hub.Controller;

import com.campushub.campus_hub.DTO.DepartmentDTO;
import com.campushub.campus_hub.Service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartmentController {
    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<Void> saveDepartment(@RequestBody DepartmentDTO departmentDTO){
        departmentService.saveDepartment(departmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments(){
        return ResponseEntity.ok(departmentService.getAllDepartment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDTO> getDepartmentById(@PathVariable("id") String id){
        return ResponseEntity.ok(departmentService.getDepartment(id));
    }

    @PutMapping
    public ResponseEntity<Void> updateDepartment(@RequestBody DepartmentDTO departmentDTO){
        departmentService.updateDepartment(departmentDTO.getDepartment_id(), departmentDTO);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDepartment(@RequestBody DepartmentDTO departmentDTO){
        departmentService.deleteDepartment(departmentDTO.getDepartment_id());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
