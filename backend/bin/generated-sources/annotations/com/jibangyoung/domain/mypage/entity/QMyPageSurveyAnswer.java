package com.jibangyoung.domain.mypage.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QMyPageSurveyAnswer is a Querydsl query type for MyPageSurveyAnswer
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMyPageSurveyAnswer extends EntityPathBase<MyPageSurveyAnswer> {

    private static final long serialVersionUID = 2035383131L;

    public static final QMyPageSurveyAnswer myPageSurveyAnswer = new QMyPageSurveyAnswer("myPageSurveyAnswer");

    public final NumberPath<Long> answerId = createNumber("answerId", Long.class);

    public final StringPath answerText = createString("answerText");

    public final NumberPath<Double> answerWeight = createNumber("answerWeight", Double.class);

    public final StringPath optionCode = createString("optionCode");

    public final StringPath questionId = createString("questionId");

    public final NumberPath<Long> responseId = createNumber("responseId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> submittedAt = createDateTime("submittedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QMyPageSurveyAnswer(String variable) {
        super(MyPageSurveyAnswer.class, forVariable(variable));
    }

    public QMyPageSurveyAnswer(Path<? extends MyPageSurveyAnswer> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMyPageSurveyAnswer(PathMetadata metadata) {
        super(MyPageSurveyAnswer.class, metadata);
    }

}

