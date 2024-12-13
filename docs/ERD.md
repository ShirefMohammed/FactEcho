# FactEcho ERD Design Specification

This document explores the design of our app FactEcho.

## **Table of Contents**
- [Storage](#storage)
  - [ERD](#erd)
  - [Tables](#tables)
- [APIs](#apis)
- [UI Design](#ui-design)
- [Auth](#auth)


## **Storage**

We'll use a relational database (schema follows) for strong organized and scalable database. We 'll use PostgreSQL.

### ERD

![ERD](./diagrams/ERD.png)

### Tables

![Tables](./diagrams/DB_Tables.png)

## **APIs**

**Auth**:

```
post: /auth/register
post: /auth/login
get: /auth/refresh
get: /auth/logout
get: /auth/verify-account
post: /auth/forget-password
get: /auth/reset-password
post: /auth/reset-password
get: /auth/login/google
get: /auth/login/google/callback
get: /auth/login/facebook
get: /auth/login/facebook/callback
```

**Users**:

```
get: /users
get: /users/search
get: /users/count
delete: /users/unverified-cleanup
get: /users/{userId}
delete: /users/{userId}
patch: /users/{userId}/details
patch: /users/{userId}/role
patch: /users/{userId}/password
patch: /users/{userId}/avatar
```

**Authors**:

```
get: /authors
get: /authors/search
get: /authors/count
get: /authors/{authorId}
patch: /authors/{authorId}/permissions
get: /authors/{authorId}/articles
```

**Categories**:

```
get: /categories
post: /categories
get: /categories/search
get: /categories/count
get: /categories/{categoryId}
patch: /categories/{categoryId}
delete: /categories/{categoryId}
get: /categories/{categoryId}/articles
```

**Articles**:

```
get: /articles
post: /articles
get: /articles/search
get: /articles/count
get: /articles/explore
get: /articles/trend
get: /articles/latest
get: /articles/saved
get: /articles/{articleId}
patch: /articles/{articleId}
delete: /articles/{articleId}
get: /articles/{articleId}/save
post: /articles/{articleId}/save
delete: /articles/{articleId}/save
```

## **UI Design**

Follow [./UI.Snapshots.md](./UI.Snapshots.md)

## **Auth**

For v1, a simple JWT-based auth mechanism is to be used, with passwords encrypted and stored in the database.
OAuth is to be added initially for Google and Facebook.
