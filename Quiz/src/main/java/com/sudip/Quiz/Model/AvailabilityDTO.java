package com.sudip.Quiz.Model;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityDTO {
    // Setters (if needed)
    // Getters
    @Setter
    @Getter
    private QuizSummary quizSummary;
    private boolean isAvailable;
    @Getter
    private LocalDateTime currentTime;

    // Constructor
    public AvailabilityDTO(QuizSummary quizSummary, boolean isAvailable) {
        this.quizSummary = quizSummary;
        this.isAvailable = isAvailable;
        this.currentTime = LocalDateTime.now();
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}