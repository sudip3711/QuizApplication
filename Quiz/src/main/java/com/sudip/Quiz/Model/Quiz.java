package com.sudip.Quiz.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String title;

    @ManyToMany
    private List<Question> questions;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_date", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate = LocalDateTime.now();


    @Column(name = "start_time")
    private LocalDateTime quizStartTime;

    @Column(name = "end_time")
    private LocalDateTime quizEndTime;

    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isActive = false;

    @Column(name = "default_points_per_question")
    private Integer defaultPointsPerQuestion = 1;

    public boolean isAvailable() {
        LocalDateTime now = LocalDateTime.now();
        return this.isActive &&
                now.isAfter(this.quizStartTime) &&
                now.isBefore(this.quizEndTime);
    }

}