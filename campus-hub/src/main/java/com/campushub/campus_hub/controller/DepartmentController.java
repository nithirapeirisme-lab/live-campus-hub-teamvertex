package com.campushub.campus_hub.controller;

import com.campushub.campus_hub.dto.DepartmentDTO;
import com.campushub.campus_hub.dao.DepartmentDao;
import com.campushub.campus_hub.exceptions.ClubNotFoundException;
import com.campushub.campus_hub.service.DepartmentService;
import com.campushub.campus_hub.service.impl.DepartmentServiceImpl;
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
    private final DepartmentServiceImpl departmentServiceImpl;
    private final DepartmentDao departmentDao;

    @PostMapping
    public ResponseEntity<String> saveDepartment(@RequestBody DepartmentDTO departmentDTO){
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id){
        try{
            departmentService.deleteDepartment(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(ClubNotFoundException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        }
    }
}
