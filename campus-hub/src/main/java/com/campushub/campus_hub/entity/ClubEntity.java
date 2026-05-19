package com.campushub.campus_hub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

@Table(name = "clubs")
public class ClubEntity {
    @Id
    @Column(name = "club_id", nullable = false)
    private String clubId;

    @Column(name= "club_name", nullable = false)
    private String clubName;

    @Column(name = "status", nullable = false)
    private boolean status;
}
