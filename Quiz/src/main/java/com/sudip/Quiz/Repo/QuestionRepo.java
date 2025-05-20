package com.sudip.Quiz.Repo;

import com.sudip.Quiz.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepo extends JpaRepository<Question,Integer> {
    @Query(value = "SELECT u.id FROM user u JOIN question q ON q.created_by = u.id WHERE u.username = :username ORDER BY q.id LIMIT 1", nativeQuery = true)
    Long findIdByUsername(String username);

    List<Question> findByCreatedBy_Id(Long id);

    @Query("SELECT DISTINCT q.category FROM Question q WHERE q.createdBy.id = :userId")
    List<String> findAllCategory(@Param("userId") Long userId);

//    @Query(
//            value = "SELECT * FROM question q " +
//                    "WHERE q.category = :category " +
//                    "AND q.created_by = :createdBy " +  // Assuming column name is 'created_by'
//                    "ORDER BY RAND() LIMIT :numQ",
//            nativeQuery = true
//    )
//    List<Question> findRandomQuestionsByCategory(  @Param("category") String category,
//                                                   @Param("createdBy") Long createdBy,  // Or Long if using ID
//                                                   @Param("numQ") int numQ);


    @Query(value = "SELECT * FROM question q WHERE q.category = :category AND q.created_by = :userId ORDER BY RAND() LIMIT :numQ",
            nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(@Param("category") String category, @Param("userId") Long userId, @Param("numQ") int numQ);
}
