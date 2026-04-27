# Client List API Contract

This document describes the frontend expectations for the coach client list.

## Endpoint

- `GET /coach/clients`

## Response envelope

```json
{
  "ok": true,
  "clients": []
}
```

## Client item contract

```json
{
  "id": 42,
  "email": "athlete@example.com",
  "name": "Ivan Petrov",
  "phone_number": "+79990000000",
  "telegram_username": "ivanpetrov",
  "joined_at": "2026-04-01T09:00:00.000Z",
  "lastActive": "2026-04-25T18:30:00.000Z",
  "createdAt": "2026-03-20T08:00:00.000Z",
  "updatedAt": "2026-04-25T18:30:00.000Z",
  "completedWorkouts": 8,
  "totalWorkouts": 12,
  "lastWorkoutDate": "2026-04-24T10:00:00.000Z",
  "nextWorkoutDate": "2026-04-27T10:00:00.000Z",
  "goal_summary": "Снижение веса и 3 силовых тренировки в неделю",
  "last_check_in_at": "2026-04-24T19:00:00.000Z",
  "planTitle": "Майский силовой блок",
  "assigned_plans_by_coach": [
    {
      "id": 7,
      "name": "Майский силовой блок",
      "start_date": "2026-04-20",
      "end_date": "2026-05-31"
    }
  ]
}
```

## Required fields for the current UI

- `id`, `email`: stable identity and navigation.
- `name`: primary display label.
- `joined_at`: displayed as the client start date in the list row.
- `lastActive`: used for activity status and attention prioritization.
- `completedWorkouts`, `totalWorkouts`: progress block in the list row.
- `lastWorkoutDate`, `nextWorkoutDate`: recent and upcoming workout context.
- `assigned_plans_by_coach` or `planTitle`: plan chips and plan count.

## New fields needed to remove frontend stubs

- `goal_summary: string | null`
  A one-line coach-facing summary of the athlete's current goal.
- `last_check_in_at: string | null`
  Timestamp of the latest athlete check-in, report, or coach-review event.

If the backend cannot provide these yet, return `null`. The frontend already renders a visible stub state for missing values.

## Formatting rules

- Use ISO 8601 strings for all dates.
- Keep `assigned_plans_by_coach` ordered by coach priority or recency.
- Return `null` for unknown optional values instead of omitting keys.
- Do not overload `lastActive` with profile update timestamps; it should reflect actual athlete activity.

## Notes for backend

- The list endpoint should stay lightweight, but it must contain enough data for coach triage without opening the client profile.
- `goal_summary` can be derived from the latest active training goal, onboarding form, or coach note.
- `last_check_in_at` can come from the latest progress report, questionnaire submission, or explicit coach check-in event.
