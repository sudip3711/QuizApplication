package com.sudip.Quiz.Model;

import lombok.*;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultDTO {
    private Integer score;
    private Integer gainScore;
    private LocalDateTime submittedAt;



}
