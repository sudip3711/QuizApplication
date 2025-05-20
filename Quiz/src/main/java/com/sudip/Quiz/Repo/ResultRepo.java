package com.sudip.Quiz.Repo;

import com.sudip.Quiz.Model.Quiz;
import com.sudip.Quiz.Model.Result;
import com.sudip.Quiz.Model.ResultDTO;
import com.sudip.Quiz.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResultRepo extends JpaRepository<Result,Integer> {

    boolean existsByUserAndQuiz(User user, Quiz quiz);


    Optional<Result> findByQuizIdAndUserId(Integer quizId, Long userId);
}
