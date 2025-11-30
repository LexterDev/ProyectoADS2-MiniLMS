package com.minilms.api.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private Long totalUsers;
    private Long totalCourses;
    private Long totalCategories;
    private Long activeEnrollments;
    private Long totalInstructors;
    private Long totalStudents;
}
