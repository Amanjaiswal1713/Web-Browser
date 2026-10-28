package com.safora.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(
            nullable = false,
            length = 2048
    )
    private String url;

    @Column(length = 2048)
    private String favicon;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    public Bookmark() {
    }

    @PrePersist
    public void beforeSave() {

        if (createdAt == null) {

            createdAt =
                    LocalDateTime.now();
        }
    }

    public Long getId() {

        return id;
    }

    public void setId(
            Long id
    ) {

        this.id = id;
    }

    public String getTitle() {

        return title;
    }

    public void setTitle(
            String title
    ) {

        this.title = title;
    }

    public String getUrl() {

        return url;
    }

    public void setUrl(
            String url
    ) {

        this.url = url;
    }

    public String getFavicon() {

        return favicon;
    }

    public void setFavicon(
            String favicon
    ) {

        this.favicon = favicon;
    }

    public LocalDateTime getCreatedAt() {

        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {

        this.createdAt = createdAt;
    }

    public User getUser() {

        return user;
    }

    public void setUser(
            User user
    ) {

        this.user = user;
    }
}