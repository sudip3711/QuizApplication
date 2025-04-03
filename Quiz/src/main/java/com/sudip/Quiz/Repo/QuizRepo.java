package com.sudip.Quiz.Repo;

import com.sudip.Quiz.Model.Quiz;
import com.sudip.Quiz.Model.QuizSummary;
import com.sudip.Quiz.Model.QuizSummaryForGetAll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuizRepo extends JpaRepository<Quiz,Integer> {

//    @Query("SELECT q FROM Quiz q WHERE q.createdBy.id = :id")
//    Optional<List<Quiz>> findByCreatedById(Long id);
//    @Query("SELECT q.title FROM Quiz q WHERE q.createdBy.id = :userId")
//    Optional<List<String>> findTitlesByCreatedBy(@Param("userId") Long userId);

//    @Query("SELECT q.id AS id, q.title AS title, q.createdDate AS createsDate FROM Quiz q WHERE q.createdBy.id = :userId")



    @Query("SELECT q.id AS id, q.title AS title, q.createdDate AS createdDate " +
        "FROM Quiz q WHERE q.createdBy.id = :userId")
    Optional<List<QuizSummaryForGetAll>> findTitlesByCreatedBy(@Param("userId") Long userId);



    List<Quiz> findByQuestions_Id(Long id);

    @Modifying
    @Query(value = "DELETE FROM quiz_questions WHERE questions_id = :questionId", nativeQuery = true)
    void removeQuestionFromAllQuizzes(@Param("questionId") Long questionId);

//    @Query("SELECT q.id as id, q.title as title, q.createdDate as createdDate " +
//            "FROM Quiz q WHERE q.id = :id")
@Query("SELECT " +
        "q.id as id, " +
        "q.title as title, " +
        "q.createdDate as createdDate, " +
        "q.quizStartTime as quizStartTime, " +
        "q.quizEndTime as quizEndTime, " +
        "q.isActive as isActive " +
        "FROM Quiz q WHERE q.id = :id")
    QuizSummary findTitlesByQuizId(Integer id);
}
