package com.safora.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    @Value("${safora.jwt.secret}")
    private String secret;

    @Value("${safora.jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        secret
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }

    public String createToken(
            String email
    ) {

        Date now =
                new Date();

        Date expiryDate =
                new Date(
                        now.getTime()
                                + expiration
                );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(
                        expiryDate
                )
                .signWith(
                        getKey()
                )
                .compact();
    }

    public String getEmail(
            String token
    ) {

        return getClaims(
                token
        ).getSubject();
    }

    public boolean isTokenValid(
            String token
    ) {

        try {

            Claims claims =
                    getClaims(
                            token
                    );

            return claims
                    .getExpiration()
                    .after(
                            new Date()
                    );

        } catch (Exception error) {

            return false;
        }
    }

    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(
                        getKey()
                )
                .build()
                .parseSignedClaims(
                        token
                )
                .getPayload();
    }
}