package com.safora.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shortcuts")
public class Shortcut {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(
            nullable = false,
            length = 2048
    )
    private String url;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    public Shortcut() {
    }

    public Long getId() {

        return id;
    }

    public void setId(
            Long id
    ) {

        this.id = id;
    }

    public String getName() {

        return name;
    }

    public void setName(
            String name
    ) {

        this.name = name;
    }

    public String getUrl() {

        return url;
    }

    public void setUrl(
            String url
    ) {

        this.url = url;
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