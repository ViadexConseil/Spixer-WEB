# Spixer API Documentation

This document provides a detailed description of the Spixer API endpoints, including the expected JSON formats for requests and responses.

## Base URL

-   **Development**: `http://localhost:8000`
-   **Production**: `https://api.spixer.fr`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Server-to-Server Authentication

For automated processes, such as a timing system sending data, a dedicated endpoint is available. This method uses an API key instead of a user-based JWT token.

### **POST** `/v1/server/records`

-   **Description**: Creates a new ranking record. This endpoint is designed for server-to-server communication and is protected by an API key and IP whitelisting.
-   **Authentication**:
    -   Requires a valid API key sent in the `X-API-Key` header.
    -   The request must originate from an IP address whitelisted in the server's environment configuration (`ALLOWED_RANKING_IP`).
-   **Request Body**:
    ```json
    {
      "ranking_id": "the-ranking-uuid",
      "face_signature": "signature-string",
      "ocr_label": "B123",
      "latitude": 48.8584,
      "longitude": 2.2945,
      "source": "timing_system"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Enregistrement créé avec succès",
      "record_id": "a-new-record-uuid"
    }
    ```

---

## Common Error Responses

The API returns consistent error responses in the following format:

```json
{
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP status codes:
-   `400` - Bad Request (e.g., missing required fields, invalid data format)
-   `401` - Unauthorized (e.g., missing or invalid token)
-   `403` - Forbidden (e.g., insufficient permissions)
-   `404` - Not Found (e.g., resource does not exist)
-   `409` - Conflict (e.g., resource already exists)
-   `500` - Internal Server Error

## Rate Limiting

To protect the API from abuse, all endpoints under the `/v1/` route are rate-limited. The current policy is:

-   **Limit**: 100 requests per 60 seconds per IP address.

If you exceed this limit, you will receive a `429 Too Many Requests` HTTP status code, and the response body will be:
```json
{
  "error": {
    "message": "Too Many Requests"
  }
}
```

---

## 1. Authentication (`AuthController`)

### **POST** `/v1/auth/register`

-   **Description**: Registers a new user.
-   **Required Roles**: None (Public)
-   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "username": "user123",
      "password": "password123"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Utilisateur créé avec succès",
      "user": {
        "id": "a-uuid-string",
        "email": "user@example.com",
        "username": "user123",
        "email_verified": false
      }
    }
    ```

### **POST** `/v1/auth/login`

-   **Description**: Logs in a user and returns a JWT token.
-   **Required Roles**: None (Public)
-   **Request Body**:
    ```json
    {
      "identifier": "user@example.com",
      "password": "password123"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Connexion réussie",
      "token": "your-jwt-token",
      "user": {
        "id": "a-uuid-string",
        "email": "user@example.com",
        "username": "user123",
        "email_verified": true
      }
    }
    ```

### **POST** `/v1/auth/logout`

-   **Description**: Logs out the current user by invalidating their token.
-   **Required Roles**: Any authenticated user.
-   **Request Body**: None
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Déconnexion réussie"
    }
    ```

### **GET** `/v1/auth/me`

-   **Description**: Retrieves the full profile of the authenticated user.
-   **Required Roles**: Any authenticated user.
-   **Request Body**: None
-   **Success Response** (200 OK):
    ```json
    {
        "user": [
            {
                "user_id": "a-uuid-string",
                "email": "user@example.com",
                "username": "user123",
                "roles": ["admin", "runner"],
                "user_created_at": "YYYY-MM-DD HH:MM:SS",
                "first_name": "John",
                "last_name": "Doe",
                "name": "John Doe",
                "bio": "A short bio.",
                "avatar_url": "http://example.com/avatar.png",
                "birthdate": "YYYY-MM-DD",
                "location": "Paris, France",
                "is_premium_member": false,
                "registrations": [
                    {
                        "registration_id": "a-uuid-string",
                        "registration_type": "runner",
                        "registration_status": "approved",
                        "registration_date": "YYYY-MM-DD HH:MM:SS",
                        "stage": {
                            "stage_id": "a-uuid-string",
                            "stage_name": "10km Race",
                            "stage_description": "A 10km race.",
                            "stage_start": "YYYY-MM-DD HH:MM:SS",
                            "stage_end": "YYYY-MM-DD HH:MM:SS",
                            "stage_registration_end": "YYYY-MM-DD HH:MM:SS",
                            "category_label": "Course à pied",
                            "event": {
                                "event_id": "a-uuid-string",
                                "event_name": "Paris Marathon",
                                "event_start": "YYYY-MM-DD HH:MM:SS",
                                "event_end": "YYYY-MM-DD HH:MM:SS",
                                "event_city": "Paris",
                                "event_country": "France"
                            }
                        },
                        "ranking": {
                            "ranking_id": "a-uuid-string",
                            "rank_position": 1,
                            "bib_number": "B123"
                        }
                    }
                ],
                "favorite_sports": [
                    {
                        "id": 1,
                        "label": "Course à pied"
                    }
                ],
                "events": [
                    {
                        "event_id": "a-uuid-string",
                        "event_name": "My Awesome Event",
                        "start_time": "YYYY-MM-DD HH:MM:SS",
                        "end_time": "YYYY-MM-DD HH:MM:SS",
                        "city": "Paris",
                        "country": "France"
                    }
                ]
            }
        ]
    }
    ```

---

## 2. User Informations (`UserInformationsController`)

### **POST** `/v1/user/informations`

-   **Description**: Creates the profile information for the authenticated user.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "bio": "A short bio.",
      "avatar_url": "http://example.com/avatar.png",
      "birthdate": "YYYY-MM-DD",
      "location": "Paris, France",
      "is_premium_member": false,
      "favorite_categories": [1, 2, 3]
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Informations utilisateur créées avec succès"
    }
    ```

### **PUT** `/v1/user/informations`

-   **Description**: Updates the profile information for the authenticated user.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "bio": "An updated bio."
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Informations utilisateur mises à jour avec succès"
    }
    ```

---

## 3. File Uploads (`UploadController`)

### **POST** `/v1/upload`

-   **Description**: Uploads a file (GPX or image). The file is sent as `multipart/form-data`.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    -   `file`: The file to upload.
    -   `type`: The type of file, either `gpx` or `img`.
-   **Success Response** (201 Created):
    ```json
    {
      "url": "http://example.com/uploads/gpx/a-unique-filename.gpx"
    }
    ```
-   **Error Responses**:
    -   `400 Bad Request`: If the file type is invalid, the file size exceeds the limit, or the file content is invalid (e.g., not valid XML for a GPX file).

---

## 4. Categories (`CategoryController`)

### **GET** `/v1/categories`

-   **Description**: Retrieves a list of all categories.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "categories": [
        {
          "id": 1,
          "label": "Course à pied"
        }
      ]
    }
    ```

### **GET** `/v1/categories/{id}`

-   **Description**: Retrieves a single category by its ID.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "category": {
        "id": 1,
        "label": "Course à pied"
      }
    }
    ```

### **POST** `/v1/categories`

-   **Description**: Creates a new category.
-   **Required Roles**: `admin`
-   **Request Body**:
    ```json
    {
      "label": "New Category"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Catégorie créée avec succès",
      "category_id": 2
    }
    ```

### **PATCH** `/v1/categories/{id}`

-   **Description**: Updates an existing category.
-   **Required Roles**: `admin`
-   **Request Body**:
    ```json
    {
      "label": "Updated Category Name"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Catégorie mise à jour avec succès"
    }
    ```

### **DELETE** `/v1/categories/{id}`

-   **Description**: Deletes a category.
-   **Required Roles**: `admin`
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Catégorie supprimée avec succès"
    }
    ```

---

## 5. Events (`EventController`)

### **GET** `/v1/events`

-   **Description**: Retrieves a list of all events.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "events": [
        {
          "id": "a-uuid-string",
          "name": "Paris Marathon",
          "description": "Annual race in Paris.",
          "start_time": "YYYY-MM-DD HH:MM:SS",
          "end_time": "YYYY-MM-DD HH:MM:SS",
          "city": "Paris",
          "country": "France",
          "organiser_email": "organizer@example.com"
        }
      ]
    }
    ```

### **GET** `/v1/events/{id}`

-   **Description**: Retrieves a single event by its ID.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "event": {
        "id": "a-uuid-string",
        "name": "Paris Marathon",
        "description": "Annual race in Paris.",
        "start_time": "YYYY-MM-DD HH:MM:SS",
        "end_time": "YYYY-MM-DD HH:MM:SS",
        "city": "Paris",
        "country": "France",
        "organiser_email": "organizer@example.com"
      }
    }
    ```

### **POST** `/v1/events`

-   **Description**: Creates a new event. Any authenticated user can create an event. If a `club_id` is provided, the user must be an admin of that club.
-   **Required Roles**: Any authenticated user
-   **Request Body**:
    ```json
    {
      "name": "My New Event",
      "description": "A description of the event.",
      "start_time": "YYYY-MM-DD HH:MM:SS",
      "end_time": "YYYY-MM-DD HH:MM:SS",
      "postal_code": "75001",
      "club_id": "a-club-uuid"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Événement créé avec succès",
      "event_id": "a-new-uuid-string"
    }
    ```

### **PATCH** `/v1/events/{id}`

-   **Description**: Updates an existing event. Only the user who created the event can update it.
-   **Required Roles**: Any authenticated user (must be the event owner)
-   **Request Body**:
    ```json
    {
      "name": "My Updated Event Name",
      "description": "An updated description.",
      "start_time": "YYYY-MM-DD HH:MM:SS",
      "end_time": "YYYY-MM-DD HH:MM:SS"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Événement mis à jour avec succès"
    }
    ```

### **DELETE** `/v1/events/{id}`

-   **Description**: Deletes an event. Only the user who created the event can delete it.
-   **Required Roles**: `organizer`
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Événement supprimé avec succès"
    }
    ```

---

## 6. Clubs (`ClubController`)

### **GET** `/v1/clubs`

-   **Description**: Retrieves a list of all clubs.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "clubs": [
        {
          "id": "a-uuid-string",
          "federation_id": "a-federation-uuid",
          "name": "Paris Runners Club",
          "description": "A club for runners in the Paris area.",
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "updated_at": "YYYY-MM-DD HH:MM:SS",
          "federation_name": "French Athletics Federation"
        }
      ]
    }
    ```

### **GET** `/v1/clubs/{id}`

-   **Description**: Retrieves the details of a specific club.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "club": {
        "id": "a-uuid-string",
        "federation_id": "a-federation-uuid",
        "name": "Paris Runners Club",
        "description": "A club for runners in the Paris area.",
        "created_at": "YYYY-MM-DD HH:MM:SS",
        "updated_at": "YYYY-MM-DD HH:MM:SS",
        "federation_name": "French Athletics Federation"
      }
    }
    ```

### **GET** `/v1/clubs/{id}/members`

-   **Description**: Retrieves the members of a specific club.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "members": [
        {
          "id": "a-user-uuid",
          "username": "eventorganizer",
          "role": "admin"
        },
        {
          "id": "another-user-uuid",
          "username": "fastrunner",
          "role": "member"
        }
      ]
    }
    ```

### **GET** `/v1/clubs/{id}/events`

-   **Description**: Retrieves the events organized by a specific club.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "events": [
        {
          "id": "an-event-uuid",
          "name": "Paris Marathon",
          "start_time": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

---

## 7. Stages (`StageController`)

### **GET** `/v1/stages`

-   **Description**: Retrieves a list of all stages.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "stages": [
        {
          "id": "a-uuid-string",
          "event_id": "the-event-uuid",
          "name": "10km Race",
          "description": "A 10km race.",
          "start_time": "YYYY-MM-DD HH:MM:SS",
          "end_time": "YYYY-MM-DD HH:MM:SS",
          "registration_end_time": "YYYY-MM-DD HH:MM:SS",
          "category_label": "Course à pied"
        }
      ]
    }
    ```

### **GET** `/v1/stages/{id}`

-   **Description**: Retrieves a single stage by its ID.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "stage": {
        "id": "a-uuid-string",
        "event_id": "the-event-uuid",
        "name": "10km Race",
        "description": "A 10km race.",
        "start_time": "YYYY-MM-DD HH:MM:SS",
        "end_time": "YYYY-MM-DD HH:MM:SS",
        "registration_end_time": "YYYY-MM-DD HH:MM:SS",
        "category_label": "Course à pied"
      }
    }
    ```

### **GET** `/v1/events/{eventId}/stages`

-   **Description**: Retrieves all stages for a given event.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "stages": [
        {
          "id": "a-uuid-string",
          "event_id": "the-event-uuid",
          "name": "10km Race",
          "description": "A 10km race.",
          "start_time": "YYYY-MM-DD HH:MM:SS",
          "end_time": "YYYY-MM-DD HH:MM:SS",
          "registration_end_time": "YYYY-MM-DD HH:MM:SS",
          "category_label": "Course à pied"
        }
      ]
    }
    ```

### **POST** `/v1/stages`

-   **Description**: Creates a new stage for an event.
-   **Required Roles**: `organizer`
-   **Request Body**:
    ```json
    {
      "event_id": "an-event-uuid",
      "name": "New Stage",
      "description": "Description of the new stage.",
      "start_time": "YYYY-MM-DD HH:MM:SS",
      "end_time": "YYYY-MM-DD HH:MM:SS",
      "registration_end_time": "YYYY-MM-DD HH:MM:SS",
      "min_age": 18
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Étape créée avec succès",
      "stage_id": "a-new-stage-uuid"
    }
    ```

### **PATCH** `/v1/stages/{id}`

-   **Description**: Updates an existing stage.
-   **Required Roles**: `organizer`
-   **Request Body**:
    ```json
    {
      "name": "Updated Stage Name",
      "min_age": 21
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Étape mise à jour avec succès"
    }
    ```

### **DELETE** `/v1/stages/{id}`

-   **Description**: Deletes a stage.
-   **Required Roles**: `organizer`
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Étape supprimée avec succès"
    }
    ```

---

## 8. Registrations (`RegistrationController`)

### **GET** `/v1/registrations`

-   **Description**: Retrieves a list of registrations for the authenticated user (as a participant or organizer).
-   **Required Roles**: Any authenticated user
-   **Success Response** (200 OK):
    ```json
    {
      "registrations": [
        {
          "id": "a-uuid-string",
          "user_id": "a-user-uuid",
          "stage_id": "a-stage-uuid",
          "type": "runner",
          "status": "approved",
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "user_email": "user@example.com",
          "stage_name": "10km Race",
          "event_name": "Paris Marathon"
        }
      ]
    }
    ```

### **GET** `/v1/registrations/{id}`

-   **Description**: Retrieves a single registration by its ID.
-   **Required Roles**: Any authenticated user (must be owner or organizer)
-   **Success Response** (200 OK):
    ```json
    {
      "registration": {
        "id": "a-uuid-string",
        "user_id": "a-user-uuid",
        "stage_id": "a-stage-uuid",
        "type": "runner",
        "status": "approved",
        "created_at": "YYYY-MM-DD HH:MM:SS",
        "user_email": "user@example.com",
        "stage_name": "10km Race",
        "event_name": "Paris Marathon"
      }
    }
    ```

### **GET** `/v1/stages/{stageId}/registrations`

-   **Description**: Retrieves all registrations for a given stage.
-   **Required Roles**: `organizer` (must be organizer of the corresponding stage)
-   **Success Response** (200 OK):
    ```json
    {
      "registrations": [
        {
          "id": "a-uuid-string",
          "user_id": "a-user-uuid",
          "stage_id": "the-stage-uuid",
          "type": "runner",
          "status": "approved",
          "created_at": "YYYY-MM-DD HH:MM:SS",
          "user_email": "user@example.com"
        }
      ]
    }
    ```

### **POST** `/v1/registrations`

-   **Description**: Registers a user for a stage. By default, it registers the authenticated user. A manager can register one of their linked guest profiles by providing a `registrant_user_id`.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "stage_id": "a-stage-uuid",
      "type": "runner",
      "registrant_user_id": "a-guest-user-uuid"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Inscription créée avec succès",
      "registration_id": "a-new-registration-uuid"
    }
    ```

### **PATCH** `/v1/registrations/{id}`

-   **Description**: Updates a registration. An organizer can change the status, and a user can change their own registration type.
-   **Required Roles**: `organizer` or authenticated user (owner)
-   **Request Body**:
    ```json
    {
      "status": "approved"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Inscription mise à jour avec succès"
    }
    ```

### **DELETE** `/v1/registrations/{id}`

-   **Description**: Deletes a registration.
-   **Required Roles**: Authenticated user (must be the owner)
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Inscription supprimée avec succès"
    }
    ```

---

## 9. Rankings (`RankingController`)

### **GET** `/v1/rankings`

-   **Description**: Retrieves a list of all rankings.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "rankings": [
        {
          "id": "a-ranking-uuid",
          "stage_id": "a-stage-uuid",
          "user_id": "a-user-uuid",
          "rank_position": 1,
          "user_email": "runner@example.com",
          "stage_name": "10km Race",
          "event_name": "Paris Marathon"
        }
      ]
    }
    ```

### **GET** `/v1/rankings/{id}`

-   **Description**: Retrieves a single ranking by its ID.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "ranking": {
        "id": "a-ranking-uuid",
        "stage_id": "a-stage-uuid",
        "user_id": "a-user-uuid",
        "rank_position": 1,
        "user_email": "runner@example.com",
        "stage_name": "10km Race",
        "event_name": "Paris Marathon"
      }
    }
    ```

### **GET** `/v1/stages/{stageId}/rankings`

-   **Description**: Retrieves the rankings for a specific stage.
-   **Required Roles**: None (Public)
-   **Success Response** (200 OK):
    ```json
    {
      "rankings": [
        {
          "id": "a-ranking-uuid",
          "stage_id": "the-stage-uuid",
          "user_id": "a-user-uuid",
          "rank_position": 1,
          "user_email": "runner@example.com"
        }
      ]
    }
    ```

### **POST** `/v1/rankings`

-   **Description**: Creates a new ranking entry.
-   **Required Roles**: `organizer`
-   **Request Body**:
    ```json
    {
      "stage_id": "a-stage-uuid",
      "user_id": "a-user-uuid",
      "rank_position": 1
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Classement créé avec succès",
      "ranking_id": "a-new-ranking-uuid"
    }
    ```

### **PATCH** `/v1/rankings/{id}`

-   **Description**: Updates an existing ranking.
-   **Required Roles**: `organizer`
-   **Request Body**:
    ```json
    {
      "rank_position": 2
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Classement mis à jour avec succès"
    }
    ```

### **DELETE** `/v1/rankings/{id}`

-   **Description**: Deletes a ranking.
-   **Required Roles**: `organizer`
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Classement supprimé avec succès"
    }
    ```

---

## 10. Ranking Records (`RankingController`)

### **GET** `/v1/rankings/{rankingId}/records`

-   **Description**: Retrieves the raw ranking records for a ranking entry.
-   **Required Roles**: `admin`, `organizer` (must be organizer of the corresponding stage)
-   **Success Response** (200 OK):
    ```json
    {
      "records": [
        {
          "id": "a-record-uuid",
          "ranking_id": "the-ranking-uuid",
          "face_signature": "signature-string",
          "ocr_label": "B123",
          "latitude": 48.8584,
          "longitude": 2.2945,
          "source": "ai",
          "captured_at": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

---

## 11. Guest Profiles (`GuestProfileController`)

This feature allows a user (a "manager") to create and manage guest profiles, for example, for their children. These guest profiles can be registered for stages, and can later be claimed by the guest to become a full, independent account.

### **POST** `/v1/profiles/guests`

-   **Description**: Creates a new guest profile linked to the authenticated user (the manager).
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "username": "guest-user-123",
      "first_name": "Guest",
      "last_name": "User",
      "birthdate": "YYYY-MM-DD"
    }
    ```
-   **Success Response** (201 Created):
    ```json
    {
      "message": "Profil invité créé avec succès",
      "guest_id": "a-new-guest-uuid"
    }
    ```

### **GET** `/v1/profiles/guests`

-   **Description**: Retrieves a list of all active guest profiles managed by the authenticated user.
-   **Required Roles**: Any authenticated user.
-   **Success Response** (200 OK):
    ```json
    {
      "guests": [
        {
          "id": "a-guest-uuid",
          "username": "guest-user-123",
          "first_name": "Guest",
          "last_name": "User",
          "birthdate": "YYYY-MM-DD"
        }
      ]
    }
    ```

### **POST** `/v1/profiles/guests/{guestId}/initiate-claim`

-   **Description**: Initiates the process for a guest to claim their profile. This sends an email to the provided address with a secure link.
-   **Required Roles**: Any authenticated user (must be the manager of the guest profile).
-   **Request Body**:
    ```json
    {
      "email": "guest.user@example.com"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Email de réclamation envoyé avec succès."
    }
    ```

### **POST** `/v1/profiles/claim`

-   **Description**: Claims a guest profile using a token from the claim email. This converts the guest profile into a full, independent account.
-   **Required Roles**: None (Public)
-   **Request Body**:
    ```json
    {
      "token": "the-secure-token-from-the-email",
      "password": "a-new-strong-password"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Compte réclamé avec succès. Vous pouvez maintenant vous connecter."
    }
    ```

---

## 12. Account Management (`AuthController`)

### **POST** `/v1/user/change-password`

-   **Description**: Allows an authenticated user to change their password.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "current_password": "their-current-password",
      "new_password": "a-new-strong-password"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Mot de passe mis à jour avec succès. Veuillez vous reconnecter."
    }
    ```

### **POST** `/v1/user/request-email-change`

-   **Description**: Initiates the process for an authenticated user to change their email address. Sends a verification link to the new email.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "new_email": "new.email@example.com"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Un e-mail de vérification a été envoyé à votre nouvelle adresse."
    }
    ```

### **POST** `/v1/user/verify-email-change`

-   **Description**: Finalizes an email change using a token from the verification email.
-   **Required Roles**: None (Public).
-   **Request Body**:
    ```json
    {
      "token": "the-secure-token-from-the-email"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "message": "Adresse e-mail mise à jour avec succès."
    }
    ```

---

## 12. Organizer Endpoints (`OrganizerController`)

### **GET** `/v1/organizer/events`

-   **Description**: Retrieves a list of all events managed by the authenticated organizer.
-   **Required Roles**: `organizer`
-   **Success Response** (200 OK):
    ```json
    {
      "events": [
        {
          "id": "an-event-uuid",
          "name": "My Awesome Event",
          "description": "A description of the event.",
          "start_time": "YYYY-MM-DD HH:MM:SS",
          "end_time": "YYYY-MM-DD HH:MM:SS"
        }
      ]
    }
    ```

---

## 13. Payments (`PaymentController`)

### **POST** `/v1/payments/intent`

-   **Description**: Creates a Stripe PaymentIntent.
-   **Required Roles**: Any authenticated user.
-   **Request Body**:
    ```json
    {
      "amount": 1000,
      "currency": "eur"
    }
    ```
-   **Success Response** (200 OK):
    ```json
    {
      "client_secret": "a-stripe-client-secret"
    }
    ```

### **POST** `/v1/payments/webhook`

-   **Description**: Handles incoming webhooks from Stripe.
-   **Required Roles**: None (Public, but secured by Stripe signature)
-   **Success Response** (200 OK):
    ```json
    {
      "received": "payment_intent.succeeded"
    }
    ```
