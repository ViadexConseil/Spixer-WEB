# Spixer API Usage Guide

Welcome to the Spixer API guide! This document provides practical, use-case-driven examples to help you integrate with our services. For detailed endpoint specifications, please refer to the [API Documentation](API_DOCUMENTATION.md).

## Table of Contents

1.  [User Management](#1-user-management)
2.  [Event & Stage Management](#2-event--stage-management)
3.  [Participant Journey](#3-participant-journey)
4.  [Club Management](#4-club-management)
5.  [Rankings and Timing](#5-rankings-and-timing)
6.  [Guest Profile Management](#6-guest-profile-management)
7.  [Volunteer Management](#7-volunteer-management)
8.  [Checkpoint Management](#8-checkpoint-management)
9.  [Miscellaneous](#9-miscellaneous)

---

## 1. User Management

This section covers the essentials of managing user accounts, from registration to ongoing account maintenance.

```mermaid
sequenceDiagram
    participant User
    participant API
    User->>API: POST /v1/auth/register (email, username, password)
    API-->>User: 201 Created (User details)
    User->>API: POST /v1/auth/login (identifier, password)
    API-->>User: 200 OK (JWT Token)
    User->>API: GET /v1/auth/me (Auth: Bearer Token)
    API-->>User: 200 OK (Full user profile)
```

### Use Case: Registering a New Account

To create a new user, send a `POST` request to the `/v1/auth/register` endpoint.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "new.user@example.com",
  "username": "newuser99",
  "password": "a-strong-password"
}'
```

**Response (201 Created):**
A successful request creates the user account but does not log them in. The user will need to verify their email.
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "a-uuid-string",
    "email": "new.user@example.com",
    "username": "newuser99",
    "email_verified": false
  }
}
```

### Use Case: Logging In

Once registered, a user can log in by sending their credentials to `/v1/auth/login`. You can use either the email or username as the `identifier`.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "identifier": "new.user@example.com",
  "password": "a-strong-password"
}'
```

**Response (200 OK):**
A successful login returns a JWT token. This token must be included in the `Authorization` header for all subsequent protected requests.
```json
{
  "message": "Connexion réussie",
  "token": "your-jwt-token",
  "user": {
    "id": "a-uuid-string",
    "email": "new.user@example.com",
    "username": "newuser99",
    "email_verified": true
  }
}
```
**Storing the Token:** The received JWT token should be stored securely on the client-side (e.g., in a secure cookie or local storage) and sent with every authenticated request.

### Use Case: Fetching Your User Profile

To get all information related to the authenticated user, send a `GET` request to `/v1/auth/me`.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/auth/me \
-H "Authorization: Bearer your-jwt-token"
```

**Response (200 OK):**
This returns a comprehensive object including personal details, registrations, created events, and more.
```json
{
    "user": [
        {
            "user_id": "a-uuid-string",
            "email": "user@example.com",
            "username": "user123",
            "roles": ["runner"],
            "first_name": "John",
            "last_name": "Doe",
            // ... and much more
        }
    ]
}
```

### Use Case: Creating and Updating Your Profile Information

A user's profile information (like name, bio, etc.) is managed separately from their core account.

**Step 1: Create Profile Information**
If the user has just registered, they first need to create their information record.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/user/informations \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "first_name": "John",
  "last_name": "Doe",
  "birthdate": "1990-05-15",
  "location": "Paris, France",
  "favorite_categories": [1, 3]
}'
```

**Step 2: Update Profile Information**
To update existing information, use the `PUT` method. You only need to send the fields you want to change.

**Request:**
```bash
curl -X PUT http://localhost:8000/v1/user/informations \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "bio": "I love running marathons!",
  "location": "Lyon, France"
}'
```

### Use Case: Changing Your Password

A logged-in user can change their password.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/user/change-password \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "current_password": "a-strong-password",
  "new_password": "a-new-stronger-password"
}'
```
**Response (200 OK):**
```json
{
  "message": "Mot de passe mis à jour avec succès. Veuillez vous reconnecter."
}
```
After this, the user will be logged out and must log in again with the new password.

### Use Case: Changing Your Email Address

```mermaid
sequenceDiagram
    participant User
    participant API
    participant NewEmailInbox
    User->>API: POST /v1/user/request-email-change (new_email, Auth Token)
    API-->>User: 200 OK (Verification email sent)
    API->>NewEmailInbox: Sends verification email with token
    NewEmailInbox-->>User: Receives email, clicks link
    User->>API: POST /v1/user/verify-email-change (token)
    API-->>User: 200 OK (Email updated)
```

Changing an email is a two-step process to ensure the user has access to the new email address.

**Step 1: Request the Change**
The user requests to change their email to a new one.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/user/request-email-change \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "new_email": "mynewemail@example.com"
}'
```
This will trigger an email to be sent to `mynewemail@example.com` containing a secure token.

**Step 2: Verify the New Email**
The user clicks the link in the email, which directs them to a page that makes the following API call (without an auth token).

**Request:**
```bash
curl -X POST http://localhost:8000/v1/user/verify-email-change \
-H "Content-Type: application/json" \
-d '{
  "token": "the-secure-token-from-the-email"
}'
```
A successful verification will update the user's email address.

### Use Case: Logging Out

To log out, send a `POST` request to `/v1/auth/logout`. This will invalidate the user's current JWT token.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/auth/logout \
-H "Authorization: Bearer your-jwt-token"
```

**Response (200 OK):**
```json
{
  "message": "Déconnexion réussie"
}
```
The client should then delete the stored JWT token.

---

## 2. Event & Stage Management

This section is for event organizers. It explains how to create and manage events and their corresponding stages. Any authenticated user can create an event, and they automatically become the `organizer` for that event.

```mermaid
graph TD
    A[Start] --> B{User Authenticated?};
    B -- Yes --> C[POST /v1/events];
    B -- No --> D[Show Error: Authentication Required];
    C --> E{Event Created Successfully?};
    E -- Yes --> F[Event ID Returned];
    F --> G[POST /v1/stages with Event ID];
    G --> H{Stage Created Successfully?};
    H -- Yes --> I{Add another stage?};
    I -- Yes --> G;
    I -- No --> J[End];
    E -- No --> K[Handle Creation Error];
    H -- No --> K;
```

### Use Case: Creating a New Event

To create a new event, send a `POST` request to `/v1/events`.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/events \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "name": "Paris Annual Marathon",
  "description": "The biggest marathon in the heart of Paris.",
  "start_time": "2026-04-12 09:00:00",
  "end_time": "2026-04-12 15:00:00",
  "postal_code": "75007"
}'
```
- If the event is being organized by a specific club, you can include a `"club_id"`. The user must be an admin of that club.

**Response (201 Created):**
```json
{
  "message": "Événement créé avec succès",
  "event_id": "a-new-event-uuid"
}
```

### Use Case: Viewing All Events

To get a list of all public events, send a `GET` request to `/v1/events`. This does not require authentication. For performance reasons, this endpoint does not include images for each event by default.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/events
```

To include all images for each event in the response, add the `?include=images` query parameter.
**Request with Images:**
```bash
curl -X GET http://localhost:8000/v1/events?include=images
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "id": "an-event-uuid",
      "name": "Paris Annual Marathon",
      "description": "The biggest marathon in the heart of Paris.",
      "start_time": "2026-04-12 09:00:00",
      "end_time": "2026-04-12 15:00:00",
      "city": "Paris",
      "country": "France",
      "organiser_email": "organizer@example.com"
    }
  ]
}
```

### Use Case: Managing Stages for an Event

Once an event is created, the organizer can add stages to it (e.g., "10km Race", "Half-Marathon", "Full Marathon").

**Step 1: Create a Stage**
The organizer sends a `POST` request to `/v1/stages`.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/stages \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "event_id": "a-new-event-uuid",
  "name": "10km Race",
  "description": "A scenic 10km race through the city.",
  "start_time": "2026-04-12 09:30:00",
  "end_time": "2026-04-12 11:00:00",
  "registration_end_time": "2026-04-01 23:59:59",
  "min_age": 16
}'
```

**Response (201 Created):**
```json
{
  "message": "Étape créée avec succès",
  "stage_id": "a-new-stage-uuid"
}
```

**Step 2: View Stages for an Event**
Anyone can view the stages for a specific event.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/events/a-new-event-uuid/stages
```

**Response (200 OK):**
```json
{
  "stages": [
    {
      "id": "a-new-stage-uuid",
      "event_id": "a-new-event-uuid",
      "name": "10km Race",
      // ... other stage details
    }
  ]
}
```

**Step 3: Update a Stage**
The organizer can update a stage's details.

**Request:**
```bash
curl -X PATCH http://localhost:8000/v1/stages/a-new-stage-uuid \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "description": "An updated, more scenic 10km race route.",
  "min_age": 18
}'
```

### Use Case: Creating Stages with Different Types

The Spixer API supports three different types of stages, each with its own method for calculating rank. The type is specified during stage creation.

#### 1. GPX-Based Stages (`type: "gpx"`)

This is the default type. Ranking is based on the participant's progress along a predefined GPX track.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/stages \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "event_id": "an-event-uuid",
  "name": "Mountain Trail",
  "type": "gpx",
  "gpx_file_url": "uploads/gpx/trail.gpx"
}'
```

#### 2. Lap-Based Stages (`type: "laps"`)

For circuit or criterium races. Ranking is based on the number of laps completed, and then by the time of the last completed lap.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/stages \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "event_id": "an-event-uuid",
  "name": "Circuit Race",
  "type": "laps",
  "lap_distance_meters": 1500,
  "required_laps": 10
}'
```

#### 3. Point-to-Point Stages (`type: "point_to_point"`)

For simple races with a defined start and finish. Ranking is based on the total elapsed time between the first and last check-in.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/stages \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "event_id": "an-event-uuid",
  "name": "City Sprint",
  "type": "point_to_point",
  "total_distance_meters": 100
}'
```


### Use Case: Bulk Registering Participants via CSV

To quickly register many participants, an organizer can upload a CSV file.

```mermaid
sequenceDiagram
    participant Organizer
    participant API
    Organizer->>API: POST /v1/stages/{id}/bulk-register (CSV File, Auth Token)
    API-->>Organizer: 200 OK (Summary of successful/failed registrations)
    Note over API: For each row, finds or creates user,<br/>creates registration, creates ranking.
```

**Request:**
The request must be `multipart/form-data` and contain a CSV file under the key `registrations_csv`. The CSV file must have a header row: `nom,prénom,dossard,email`.

```bash
curl -X POST http://localhost:8000/v1/stages/a-stage-uuid/bulk-register \
-H "Authorization: Bearer your-jwt-token" \
-F "registrations_csv=@/path/to/your/participants.csv"
```

**Response (200 OK):**
```json
{
    "message": "Traitement du CSV terminé.",
    "successful_registrations": 50,
    "failed_registrations": 2,
    "errors": [
        "Dossard 999 pour invalid@example.com est en dehors de la plage autorisée.",
        "Ligne invalide: ,,,"
    ]
}
```

### Use Case: Defining a Bib Number Range for a Stage

To ensure data integrity, an organizer can define a valid range for bib numbers for a specific stage. The system will then reject any attempt to assign a bib number outside this range.

**Request:**
Include the `bib_number_min` and `bib_number_max` fields when creating or updating a stage.
```bash
curl -X POST http://localhost:8000/v1/stages \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "event_id": "an-event-uuid",
  "name": "10km Race with Bib Validation",
  "bib_number_min": 100,
  "bib_number_max": 500
}'
```
Now, if anyone (including the organizer) tries to create a ranking for this stage with a bib number of, for example, `99` or `501`, the API will return a `400 Bad Request` error.

### Use Case: Updating an Event

The event organizer can update the event's details.

**Request:**
```bash
curl -X PATCH http://localhost:8000/v1/events/a-new-event-uuid \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "name": "The 2026 Paris Annual Marathon"
}'
```

### Use Case: Deleting an Event

The event organizer can delete an event. This is a permanent action.

**Request:**
```bash
curl -X DELETE http://localhost:8000/v1/events/a-new-event-uuid \
-H "Authorization: Bearer your-jwt-token"
```

### Use Case: Managing Event, Club, and Stage Images

Organizers and administrators can enrich their events, clubs, and stages by adding images. These images can also be removed.

**Note:** These endpoints are the correct way to associate an image with a specific entity. They upload the file to the cloud (S3) and create a record in the database linking the image to the event, club, or stage. This is different from the generic `POST /v1/upload` endpoint, which is for general-purpose file uploads.

**Step 1: Upload an Image**
To add an image, send a `POST` request to the appropriate endpoint (`/v1/events/{id}/image`, `/v1/clubs/{id}/image`, or `/v1/stages/{id}/image`). The request must be `multipart/form-data` and contain the image file.

**Request:**
```bash
# Example for an event
curl -X POST http://localhost:8000/v1/events/a-new-event-uuid/image \
-H "Authorization: Bearer your-jwt-token" \
-F "image=@/path/to/your/event_banner.jpg"
```

**Response (201 Created):**
```json
{
    "message": "Image uploadée avec succès",
    "url": "https://your-s3-bucket.s3.eu-west-3.amazonaws.com/events/a-uuid-string/a-unique-filename.jpg"
}
```

**Step 2: Delete an Image**
To remove an image, send a `DELETE` request to the same endpoint, providing the full URL of the image to be deleted in the JSON body.

**Request:**
```bash
# Example for an event
curl -X DELETE http://localhost:8000/v1/events/a-new-event-uuid/image \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "url": "https://your-s3-bucket.s3.eu-west-3.amazonaws.com/events/a-uuid-string/a-unique-filename.jpg"
}'
```

**Response (200 OK):**
```json
{
  "message": "Image supprimée avec succès."
}
```

### Use Case: Managing Club Membership

```mermaid
sequenceDiagram
    participant User
    participant ClubAdmin
    participant API
    User->>API: POST /v1/clubs/{id}/join (Auth Token)
    API-->>User: 201 Created (Request pending)
    ClubAdmin->>API: POST /v1/clubs/{clubId}/members/{memberId}/approve (Auth Token)
    API-->>ClubAdmin: 200 OK (Member approved)
    ClubAdmin->>API: DELETE /v1/clubs/{clubId}/members/{memberId} (Auth Token)
    API-->>ClubAdmin: 200 OK (Member removed)
```

**Step 1: Requesting to Join a Club**
A user can request to join any club.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/clubs/a-club-uuid/join \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "license_number": "LIC12345"
}'
```

**Step 2: Approving a Membership Request (Club Admin)**
A club admin can approve a pending request.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/clubs/a-club-uuid/members/a-user-uuid/approve \
-H "Authorization: Bearer admin-jwt-token"
```

**Step 3: Removing a Member (Club Admin or User)**
A club admin can remove a member, or a user can remove themselves.

**Request:**
```bash
curl -X DELETE http://localhost:8000/v1/clubs/a-club-uuid/members/a-user-uuid \
-H "Authorization: Bearer admin-or-user-jwt-token"
```

---

## 3. Participant Journey

This section follows the journey of a user participating in an event, from finding an event to registering for it.

```mermaid
sequenceDiagram
    participant User
    participant API
    User->>API: GET /v1/events
    API-->>User: 200 OK (List of all events)
    User->>API: GET /v1/events/{eventId}/stages
    API-->>User: 200 OK (List of stages for the event)
    User->>API: POST /v1/registrations (stage_id, Auth Token)
    API-->>User: 201 Created (Registration successful, status: pending)
```

### Use Case: Discovering Events and Stages

A user can browse all public events and their stages without being logged in.

**Step 1: Find an Interesting Event**
The user can fetch a list of all events.
```bash
curl -X GET http://localhost:8000/v1/events
```
From the list, they can identify an `event_id` that interests them, for example, `"a-new-event-uuid"`.

**Step 2: View the Stages for That Event**
Using the `event_id`, the user can see the specific stages available.
```bash
curl -X GET http://localhost:8000/v1/events/a-new-event-uuid/stages
```
This will return details for each stage, including its `stage_id`. Let's say the user chooses a stage with `id: "a-new-stage-uuid"`.

### Use Case: Registering for a Stage

Once a user has chosen a stage, they can register for it as a "runner". An organizer can also include a `bib_number` during this process, which is essential for the automated timing system to work.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/registrations \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "stage_id": "a-new-stage-uuid",
  "type": "runner",
  "bib_number": "B123"
}'
```

**Response (201 Created):**
```json
{
  "message": "Inscription créée avec succès",
  "registration_id": "a-new-registration-uuid"
}
```
The registration is created with a `pending` status by default. An event organizer will need to approve it.

### Use Case: Viewing Your Registrations

A user can see all of their own registrations (and their current status) by calling the `/v1/registrations` endpoint.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/registrations \
-H "Authorization: Bearer your-jwt-token"
```

**Response (200 OK):**
```json
{
  "registrations": [
    {
      "id": "a-new-registration-uuid",
      "user_id": "the-user-uuid",
      "stage_id": "a-new-stage-uuid",
      "type": "runner",
      "status": "pending",
      "created_at": "YYYY-MM-DD HH:MM:SS",
      "user_email": "user@example.com",
      "stage_name": "10km Race",
      "event_name": "Paris Annual Marathon"
    }
  ]
}
```

### Use Case: Canceling a Registration

If a user decides they no longer want to participate, they can delete their registration.

### Use Case: Finding Live Stages Near You

A user can find stages that are currently in progress near their physical location. This is useful for spectators or participants who are on the course.

**Request:**
This endpoint requires the `event_id` in the path, and the user's current `lat` and `long` as query parameters.

```bash
curl -X GET "http://localhost:8000/v1/events/an-event-uuid/stages/live?lat=48.155&long=-1.691"
```
You can also provide an optional `tolerance` parameter (in meters). The default is 50 meters.
```bash
curl -X GET "http://localhost:8000/v1/events/an-event-uuid/stages/live?lat=48.155&long=-1.691&tolerance=100"
```

**Response (200 OK):**
The response will be a list of stage objects that are currently live and whose GPX track is near the provided coordinates.
```json
{
  "stages": [
    {
      "id": "a-live-stage-uuid",
      "name": "10km City Run",
      // ... other stage details
    }
  ]
}
```

**Request:**
```bash
curl -X DELETE http://localhost:8000/v1/registrations/a-new-registration-uuid \
-H "Authorization: Bearer your-jwt-token"
```

**Response (200 OK):**
```json
{
  "message": "Inscription supprimée avec succès"
}
```

---

## 4. Club Management

This section details how to interact with club-related data. While browsing clubs, members, and events is public, creating or modifying a club requires authentication and administrator privileges.

### Use Case: Creating a Club

Any authenticated user can create a club. The user who creates the club automatically becomes its first administrator.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/clubs \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "name": "The Trail Blazers",
  "description": "A friendly club for trail running enthusiasts."
}'
```

**Response (201 Created):**
```json
{
  "message": "Club créé avec succès",
  "club_id": "a-new-club-uuid"
}
```

### Use Case: Listing All Clubs

To get a directory of all clubs on the platform, send a `GET` request to `/v1/clubs`.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/clubs
```

To include all images for each club in the response, add the `?include=images` query parameter.
**Request with Images:**
```bash
curl -X GET http://localhost:8000/v1/clubs?include=images
```

**Response (200 OK):**
```json
{
  "clubs": [
    {
      "id": "a-club-uuid",
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

### Use Case: Viewing a Club's Members

To see the members of a specific club, use its `id`.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/clubs/a-club-uuid/members
```

**Response (200 OK):**
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

### Use Case: Viewing a Club's Events

To see all the events organized by a specific club, use its `id`.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/clubs/a-club-uuid/events
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "id": "an-event-uuid",
      "name": "Club Championship 2026",
      "start_time": "2026-09-05 10:00:00"
    }
  ]
}
```

---

## 5. Rankings and Timing

This section explains how to view and manage rankings. It also covers the dedicated endpoint for server-to-server timing data submission.

### Use Case: Viewing All Stages (Public)

To get a list of all public stages across all events, send a `GET` request to `/v1/stages`.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/stages
```

To include all images for each stage in the response, add the `?include=images` query parameter.
**Request with Images:**
```bash
curl -X GET http://localhost:8000/v1/stages?include=images
```

### Use Case: Viewing Stage Rankings (Public)

Anyone can view the official rankings for a particular stage.

**Request:**
```bash
curl -X GET http://localhost:8000/v1/stages/a-new-stage-uuid/rankings
```

**Response (200 OK):**
```json
{
  "rankings": [
    {
      "id": "a-ranking-uuid",
      "stage_id": "a-new-stage-uuid",
      "user_id": "a-user-uuid",
      "rank_position": 1,
      "user_email": "runner@example.com"
    },
    {
      "id": "another-ranking-uuid",
      "stage_id": "a-new-stage-uuid",
      "user_id": "another-user-uuid",
      "rank_position": 2,
      "user_email": "runner2@example.com"
    }
  ]
}
```

### Use Case: Manually Managing Rankings (Organizer)

An event organizer can manually create, update, or delete ranking entries. This is useful for correcting errors or adding manual entries. If the stage has a bib number range defined, it will be validated upon creation.

```mermaid
sequenceDiagram
    participant Organizer
    participant API
    Organizer->>API: POST /v1/rankings (stage_id, user_id, bib_number, Auth Token)
    alt Stage has Bib Range
        API->>API: Check if bib_number is in range
        alt Bib is Valid
            API-->>Organizer: 201 Created (Ranking created)
        else Bib is Invalid
            API-->>Organizer: 400 Bad Request (Error message)
        end
    else Stage has no Bib Range
        API-->>Organizer: 201 Created (Ranking created)
    end
```

**Step 1: Create a Ranking Entry**
```bash
curl -X POST http://localhost:8000/v1/rankings \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "stage_id": "a-new-stage-uuid",
  "user_id": "a-user-uuid",
  "rank_position": 1
}'
```

**Step 2: Update a Ranking Entry**
```bash
curl -X PATCH http://localhost:8000/v1/rankings/a-ranking-uuid \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "rank_position": 2
}'
```

### Use Case: Submitting Timing Data (AI Camera System)

```mermaid
sequenceDiagram
    participant AICamera
    participant API
    AICamera->>API: POST /v1/server/records (stage_id, ocr_label, etc. + X-API-Key)
    alt Ranking for bib does not exist
        API->>API: 1. Find user_id from registrations via bib (ocr_label)
        API->>API: 2. Create new ranking entry
    end
    API->>API: 3. Create ranking_record
    API->>API: 4. Trigger ranking recalculation
    API-->>AICamera: 201 Created (Record created)
```

This special endpoint is designed for automated timing systems (like AI-powered cameras) to push data to Spixer. It is protected by an API key, not a user JWT.

When a record is submitted, the system checks if a ranking entry already exists for that `ocr_label` (bib number) on that stage. If not, it automatically creates one by finding the registered participant with that bib number. This makes the system robust and easy to integrate with automated hardware.

**Request:**
- The request must include a `X-API-Key` header.

```bash
curl -X POST http://localhost:8000/v1/server/records \
-H "X-API-Key: your-secret-api-key" \
-H "Content-Type: application/json" \
-d '{
  "stage_id": "a-stage-uuid",
  "ocr_label": "B456",
  "face_signature": "a-unique-face-signature-string",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "source": "camera_finish_line_1"
}'
```

**Response (201 Created):**
```json
{
  "message": "Enregistrement créé avec succès",
  "record_id": "a-new-record-uuid"
}
```

---

## 6. Guest Profile Management

This section explains how a user (a "manager") can manage guest profiles for others (e.g., their children), register them for events, and how a guest can later claim their account.

```mermaid
sequenceDiagram
    participant Manager
    participant Guest
    participant API
    participant GuestEmailInbox
    Manager->>API: POST /v1/profiles/guests (guest details, Auth Token)
    API-->>Manager: 201 Created (guest_id)
    Manager->>API: POST /v1/registrations (stage_id, registrant_user_id=guest_id, Auth Token)
    API-->>Manager: 201 Created (Registration successful)
    Manager->>API: POST /v1/profiles/guests/{guestId}/initiate-claim (email, Auth Token)
    API-->>Manager: 200 OK
    API->>GuestEmailInbox: Sends claim email with token
    GuestEmailInbox-->>Guest: Receives email, clicks link
    Guest->>API: POST /v1/profiles/claim (token, password)
    API-->>Guest: 200 OK (Account claimed)
```

### Use Case: Creating a Guest Profile

A manager can create a new guest profile under their account.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/profiles/guests \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "username": "young-runner-jane",
  "first_name": "Jane",
  "last_name": "Doe",
  "birthdate": "2010-08-20"
}'
```

**Response (201 Created):**
```json
{
  "message": "Profil invité créé avec succès",
  "guest_id": "a-new-guest-uuid"
}
```

### Use Case: Registering a Guest for a Stage

When registering for a stage, the manager can specify the `registrant_user_id` to register one of their managed guests instead of themselves.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/registrations \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "stage_id": "a-new-stage-uuid",
  "type": "runner",
  "registrant_user_id": "a-new-guest-uuid"
}'
```

### Use Case: Claiming a Guest Account

The guest can eventually take control of their own profile and convert it into a full account.

**Step 1: Manager Initiates the Claim**
The manager sends a request to start the claim process, providing the guest's future email address.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/profiles/guests/a-new-guest-uuid/initiate-claim \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "email": "jane.doe@example.com"
}'
```
This sends an email containing a secure token to `jane.doe@example.com`.

**Step 2: Guest Claims the Account**
The guest uses the token from the email to create a password and finalize their new, independent account. This request does not require authentication.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/profiles/claim \
-H "Content-Type: application/json" \
-d '{
  "token": "the-secure-token-from-the-email",
  "password": "janes-new-strong-password"
}'
```

**Response (200 OK):**
```json
{
  "message": "Compte réclamé avec succès. Vous pouvez maintenant vous connecter."
}
```
The guest profile is now a full user account, and the original manager no longer controls it.

---

## 7. Volunteer Management

This section covers the process of applying to be a volunteer and how organizers manage those applications. Volunteers are associated with an entire event, not a specific stage.

```mermaid
sequenceDiagram
    participant User
    participant Organizer
    participant API
    User->>API: POST /v1/events/{eventId}/volunteers (Auth Token)
    API-->>User: 201 Created (Application received)
    Organizer->>API: GET /v1/events/{eventId}/volunteers (Auth Token)
    API-->>Organizer: 200 OK (List of volunteers)
    Organizer->>API: PATCH /v1/events/{eventId}/volunteers/{userId} (status: 'approved', Auth Token)
    API-->>Organizer: 200 OK (Assignment updated)
```

### Use Case: Applying to Volunteer

Any authenticated user can apply to volunteer at an event.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/events/an-event-uuid/volunteers \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "role": "First Aid Station",
  "notes": "I am a certified paramedic and available for the entire event duration."
}'
```
- The request body is optional. A user can apply without specifying a role or notes.

**Response (201 Created):**
```json
{
  "message": "Successfully applied to volunteer. Your application is pending approval.",
  "assignment_id": "a-new-assignment-uuid"
}
```

### Use Case: Managing Volunteers (Organizer)

The event organizer can view all volunteer applications and approve, reject, or update them.

**Step 1: View All Volunteer Applications for an Event**
```bash
curl -X GET http://localhost:8000/v1/events/an-event-uuid/volunteers \
-H "Authorization: Bearer your-jwt-token"
```

**Response (200 OK):**
```json
{
  "volunteers": [
    {
      "id": "a-new-assignment-uuid",
      "user_id": "a-volunteer-user-uuid",
      "username": "helpful-volunteer",
      "email": "volunteer@example.com",
      "status": "pending",
      "role": "First Aid Station",
      "notes": "I am a certified paramedic...",
      "created_at": "YYYY-MM-DD HH:MM:SS"
    }
  ]
}
```

**Step 2: Approve or Update a Volunteer's Assignment**
The organizer uses the event ID and the volunteer's user ID to update their assignment.

**Request:**
```bash
curl -X PATCH http://localhost:8000/v1/events/an-event-uuid/volunteers/a-volunteer-user-uuid \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "status": "approved",
  "role": "Lead Paramedic - Finish Line",
  "notes": "Please report to the medical tent at 8 AM."
}'
```

**Response (200 OK):**
```json
{
  "message": "Volunteer assignment updated successfully."
}
```
- To reject a volunteer, the organizer can set the `status` to `"rejected"`.

---

## 8. Checkpoint Management

### Use Case: Assigning a Volunteer to a Checkpoint

An event organizer can assign a registered volunteer to a specific checkpoint.

**Request:**
```bash
curl -X POST http://localhost:8000/v1/checkpoints/a-checkpoint-uuid/assign \
-H "Authorization: Bearer organizer-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "volunteer_user_id": "a-volunteer-user-uuid"
}'
```

**Response (201 Created):**
```json
{
  "message": "Volunteer assigned successfully.",
  "assignment_id": "a-new-assignment-uuid"
}
```

---

## 9. Miscellaneous

This section covers other important functionalities like file uploads and payments.

### Use Case: Uploading a File

The API supports uploading files for specific purposes, such as GPX files for stage routes or images for user avatars. This is done using a `multipart/form-data` request.

**Note:** This is a generic endpoint that uploads a file to a temporary public directory and returns a URL. It does **not** link the file to any specific entity (like an event or club) in the database. For associating images directly with an entity, please use the dedicated endpoints like `POST /v1/events/{id}/image`.

**Request:**
- `type`: Must be either `gpx` or `img`.
- `file`: The file data.

```bash
curl -X POST http://localhost:8000/v1/upload \
-H "Authorization: Bearer your-jwt-token" \
-F "type=gpx" \
-F "file=@/path/to/your/stage_route.gpx"
```

**Response (201 Created):**
The API returns a secure URL for the uploaded file. This URL can then be used in other API calls, for example, when creating or updating a user's profile information (`avatar_url`).
```json
{
  "url": "http://example.com/uploads/gpx/a-unique-filename.gpx"
}
```

### Use Case: Handling Payments with Stripe

The API integrates with Stripe to handle payments, for instance, for event registration fees. The process involves creating a `PaymentIntent` on the backend.

**Request:**
The client requests a `PaymentIntent` from the server, specifying the amount (in the smallest currency unit, e.g., cents) and currency.

```bash
curl -X POST http://localhost:8000/v1/payments/intent \
-H "Authorization: Bearer your-jwt-token" \
-H "Content-Type: application/json" \
-d '{
  "amount": 2500,
  "currency": "eur"
}'
```

**Response (200 OK):**
The API returns a `client_secret` for the PaymentIntent.
```json
{
  "client_secret": "a-stripe-client-secret_pi_..."
}
```
This `client_secret` is then used on the frontend with the Stripe.js library to finalize the payment. The `/v1/payments/webhook` endpoint is used by Stripe to send notifications about payment status changes (e.g., `payment_intent.succeeded`) back to the Spixer server.
