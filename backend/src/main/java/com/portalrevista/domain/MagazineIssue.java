package com.portalrevista.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "magazine_issues")
@Getter
@Setter
public class MagazineIssue {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(name = "issue_number", nullable = false)
  private Integer issueNumber;

  @Column(name = "cover_image_url", nullable = false)
  private String coverImageUrl;

  @Column(name = "published_at", nullable = false)
  private LocalDate publishedAt;

  @Column(name = "editorial_html", columnDefinition = "TEXT")
  private String editorialHtml;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private IssueStatus status = IssueStatus.DRAFT;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public enum IssueStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
  }
}
