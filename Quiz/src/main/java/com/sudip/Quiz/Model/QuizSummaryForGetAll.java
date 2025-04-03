package com.sudip.Quiz.Model;

import java.time.LocalDateTime;

public interface QuizSummaryForGetAll {
    Long getId();
    String getTitle();
    LocalDateTime getCreatedDate();
}
