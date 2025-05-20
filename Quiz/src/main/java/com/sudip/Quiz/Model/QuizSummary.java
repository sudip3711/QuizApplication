package com.sudip.Quiz.Model;

import java.time.LocalDateTime;

public interface QuizSummary {
    Long getId();
    String getTitle();
    LocalDateTime getCreatedDate();
    LocalDateTime getQuizStartTime();
    LocalDateTime getQuizEndTime();
    Boolean getIsActive();
}
