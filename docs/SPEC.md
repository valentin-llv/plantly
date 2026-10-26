# Plantly specification

## 1. Product overview

**Plantly** is a local-first Progressive Web App (PWA) for tracking a user's plants over time. It helps users keep basic information about each plant, remember when it needs watering, record care events, track its weight, and observe its growth through a dated photo history.

The first release stores all data on the user's device. No account or cloud service is required. Cloud synchronization may be added in a future version.

### 1.1 App goals

From the app, a user must be able to:

1. Add and manage a personal collection of plants, with essential information and notes (PLANT).
2. Configure an optional recurring watering interval, record watering, and have the next watering date calculated automatically (WATER).
3. Snooze or dismiss a watering reminder instead of recording a watering (WATER, REM).
4. Review a plant's watering history in a dedicated calendar (WATER).
5. Record each time a plant is fertilized and review those dates in a dedicated calendar (FERT).
6. See a home-page list of plants that are due for watering, resolve each reminder quickly, and optionally receive notifications (REM).
7. Add dated photos with optional descriptions and browse a plant's evolution in a photo carousel (PHOTO).
8. Record the weight of a plant (in grams) over time and view a graph of its evolution (WEIGHT).
9. Record the height of a plant (in cm) over time and view a graph of its evolution (HEIGHT).
10. Understand the app on first use through an intro, and get helpful empty states (ONB).
11. Move around the app through two main tabs and a plant detail page (NAV).
12. Keep all data on the device, use the app offline, and understand and manage local storage (STORE).
13. Export and import local data for recovery, and be warned when backups are outdated (BACKUP).

### 1.2 Out of scope for v1

- User accounts and cloud synchronization.
- Sorting, filtering, and searching the plant collection.
- In-app camera capture (photos come from uploads only).
- Fertilizing reminders.
- Merging imported data with existing data (import replaces).
- Editing or deleting arbitrary history entries (only the most recent entry of a history can be deleted).
- Languages other than English.

## 2. Functional requirements

Requirement IDs use the form `AREA-NN`. An ID is never reused or renumbered, even if a requirement is removed later.

### 2.1 Plant management (PLANT)

- **PLANT-01 — Add a plant:** The user can create a plant with a required name. Optional fields are type (free-form text), watering interval, notes, a photo, an initial weight (in grams), and an initial height (in cm).
- **PLANT-02 — Add a plant photo at creation:** The user can optionally add a photo when creating a plant. The photo follows the same upload, dating, and compression rules as any other photo (see PHOTO-02, PHOTO-03, PHOTO-05).
- **PLANT-03 — Edit a plant:** The user can update the plant's name, type, watering interval, and notes through the edit page. Weight, height, and photos are not edited there; they are managed from their own views (see WEIGHT-02, HEIGHT-02, and PHOTO-07).
- **PLANT-04 — View plants:** The user can view their plants in a collection and open an individual plant's detail view. Each plant in the collection shows its cover photo (see PHOTO-08), name, and type.
- **PLANT-05 — Delete a plant:** The user can permanently delete a plant and its associated photos, weight records, height records, and care history after an explicit confirmation.
- **PLANT-06 — Store plant notes:** The user can enter free-form text for any additional information or care notes.
- **PLANT-07 — Confirm before leaving the create form:** When the user tries to exit the plant creation form, the app asks for confirmation before leaving the form.
- **PLANT-08 — Confirm before leaving the edit form:** When the user tries to exit the plant edit form, the app asks for confirmation before leaving the form.

### 2.2 Watering (WATER)

- **WATER-01 — Configure watering interval:** The user can set an optional interval, in whole days (minimum 1), between watering events for each plant.
- **WATER-02 — Initial watering on creation:** When a plant is created, a `watered` action dated with the creation date is added to its watering history. This happens whether or not a watering interval is configured.
- **WATER-03 — Record watering:** The user can record that a plant was watered today. The app saves a `watered` action with the current date.
- **WATER-04 — Calculate next watering date:** When a watering interval is configured, the next watering date is calculated from the most recent watering action:
  - after a `watered` or `dismissed` action: action date + interval;
  - after a `snoozed` action: action date + half the interval, rounded up (minimum 1 day).
- **WATER-05 — Snooze a reminder:** The user can snooze a plant's watering reminder. This records a `snoozed` action dated today. The next watering date becomes today + half the interval (rounded up).
- **WATER-06 — Dismiss a reminder:** The user can dismiss a plant's watering reminder. This records a `dismissed` action dated today. The next watering date becomes today + the full interval, as if the plant had been watered.
- **WATER-07 — Show watering status:** The plant detail view shows one of the following statuses, based on the configured interval and the most recent watering action:
  - **Not configured:** the plant has no watering interval.
  - **Upcoming:** today is before the next watering date.
  - **Due:** today is the next watering date.
  - **Overdue:** the next watering date has passed by one or more days.
- **WATER-08 — Record watering history:** The app stores every watering action (`watered`, `snoozed`, or `dismissed`) with its date.
- **WATER-09 — Delete the last watering action:** The user can delete the most recent watering action when the recorded history is inaccurate. The previous action then becomes the most recent one and can in turn be deleted. If no action remains, the plant's creation date is used as the baseline, as if a `watered` action existed on that date, and the next watering date is calculated from it.
- **WATER-10 — Change watering interval:** If the user changes the watering interval, the app keeps the most recent watering action as the baseline and recalculates the next watering date with the new interval.
- **WATER-11 — Watering calendar:** The plant detail view gives access to a watering calendar showing the plant's watering history, distinguishing `watered`, `snoozed`, and `dismissed` actions, and showing the next scheduled watering date when a watering interval is configured. From this calendar the user can delete the most recent watering action (see WATER-09).

### 2.3 Fertilizing (FERT)

- **FERT-01 — Record fertilizing:** The user can record that a plant was fertilized today. The app saves a `fertilized` action with the current date. The plant detail view shows the most recent fertilizing date.
- **FERT-02 — Fertilizing calendar:** The plant detail view gives access to a fertilizing calendar showing all dates on which the plant was fertilized.
- **FERT-03 — Delete the last fertilizing entry:** The user can delete the most recent fertilizing entry, for example from the fertilizing calendar. The previous entry then becomes the most recent one and can in turn be deleted.
- **FERT-04 — No fertilizing reminders:** The app does not create reminders or notifications for fertilizing.

### 2.4 Reminders (REM)

- **REM-01 — Show due plants on the home page:** The home page contains a list of due and overdue plants.
- **REM-02 — Quick-water action:** Each due plant has a shortcut to record that it was watered without opening the full plant detail view (see WATER-03).
- **REM-03 — Quick-snooze action:** Each due plant has a shortcut to snooze its watering reminder (see WATER-05).
- **REM-04 — Quick-dismiss action:** Each due plant has a shortcut to dismiss its watering reminder (see WATER-06).
- **REM-05 — Reminders require an interval:** A plant without a watering interval does not produce a watering reminder.
- **REM-06 — Recalculate after an action:** After a watered, snoozed, or dismissed action is recorded or deleted, the reminder state and next watering date are recalculated from the most recent remaining action.
- **REM-07 — In-app reminders:** Due and overdue plants are surfaced inside the app through the home-page list (REM-01).
- **REM-08 — Push notifications:** The app can send a notification when plants are due for watering. Notifications are opt-in: the app requests permission only after an explicit user action, and the user can turn notifications off again. Delivery depends on browser and platform capabilities (see section 6).

### 2.5 Photo history (PHOTO)

- **PHOTO-01 — Add plant photos:** The user can add photos to an existing plant.
- **PHOTO-02 — Photos come from uploads only:** Photos are added only by uploading existing image files from the device (for example, from the phone gallery). The app does not use the camera API and does not offer in-app photo capture. This applies both to photos added when creating a plant (PLANT-02) and to photos added to an existing plant (PHOTO-01).
- **PHOTO-03 — Date photos from EXIF:** Each photo has a local calendar date. When an uploaded file contains an EXIF capture date, the app uses it as the default photo date. When it does not, the app defaults to the current date. In both cases the user can correct the date.
- **PHOTO-04 — Describe photos:** The user can optionally add a description to a photo.
- **PHOTO-05 — Compress and downscale photos:** Uploaded photos are downscaled (longest side at most 1600 px) and re-encoded in a compressed format (WebP or JPEG) before being stored, to save local storage. The EXIF date is read from the original file before compression.
- **PHOTO-06 — Browse plant evolution:** The user can browse a plant's photos in a dedicated carousel, ordered from the most recent photo to the oldest.
- **PHOTO-07 — Manage photos:** The user can remove a photo and edit its description and date.
- **PHOTO-08 — Plant cover photo:** A plant's cover photo is its most recent photo (by photo date; ties are broken by creation time). A plant without photos shows a default placeholder.
- **PHOTO-09 — Confirm before leaving the photo form:** When the user tries to exit the add-photo or edit-photo form, the app asks for confirmation before leaving the form.

### 2.6 Weight tracking (WEIGHT)

- **WEIGHT-01 — Initial weight at creation:** The user can optionally enter the weight of a plant, in grams (whole number), in the plant creation form. This creates a weight record dated with the creation date. A plant without a weight is valid.
- **WEIGHT-02 — Add a weight entry:** From the plant detail view, a dedicated button lets the user record a new weight in grams, in the same way as recording a watering. The app saves a weight record with the current date. Weight is not part of the plant edit page.
- **WEIGHT-03 — Store weight locally:** Each recorded weight is saved in the local database as a dated weight record linked to its plant, so the weight history persists offline and is retained across sessions.
- **WEIGHT-04 — Weight evolution graph:** The user can view a graph of the evolution of a plant's weight, in grams, over time from the plant detail view.
- **WEIGHT-05 — Delete the last weight entry:** The user can delete the most recent weight record when it is inaccurate. The previous record then becomes the most recent one and can in turn be deleted.
- **WEIGHT-06 — Weight empty state:** When a plant has no weight record, the graph area shows a clear empty state explaining how to add a weight. When it has only one record, the app shows that value without implying a trend.

### 2.7 Height tracking (HEIGHT)

- **HEIGHT-01 — Initial height at creation:** The user can optionally enter the height of a plant, in centimeters, in the plant creation form. This creates a height record dated with the creation date. A plant without a height is valid.
- **HEIGHT-02 — Add a height entry:** From the plant detail view, a dedicated button lets the user record a new height in centimeters, in the same way as recording a weight. The app saves a height record with the current date. Height is not part of the plant edit page.
- **HEIGHT-03 — Store height locally:** Each recorded height is saved in the local database as a dated height record linked to its plant, so the height history persists offline and is retained across sessions.
- **HEIGHT-04 — Height evolution graph:** The user can view a graph of the evolution of a plant's height, in centimeters, over time from the plant detail view.
- **HEIGHT-05 — Delete the last height entry:** The user can delete the most recent height record when it is inaccurate. The previous record then becomes the most recent one and can in turn be deleted.
- **HEIGHT-06 — Height empty state:** When a plant has no height record, the graph area shows a clear empty state explaining how to add a height. When it has only one record, the app shows that value without implying a trend.

### 2.8 Onboarding and empty states (ONB)

- **ONB-01 — First-run intro:** On first launch, the app displays an intro made of slides that explain the app. The user can go through the slides or skip them. The intro is shown only once; completion is stored locally.
- **ONB-02 — Home empty states:** The home page shows a clear empty state when the user has no plants (inviting them to add one) and a different empty state when plants exist but none is due.
- **ONB-03 — Plants page empty state:** The Plants page shows a clear empty state when the collection is empty, with a shortcut to add a plant.

### 2.9 Navigation and views (NAV)

- **NAV-01 — Main tabs:** The app is organized around two main tabs: **Home** and **Plants**. Home shows the due and overdue plants list (REM-01); Plants shows the plant collection (PLANT-04).
- **NAV-02 — Plant detail page:** Each plant has a detailed view page, opened from the Plants tab (and from reminders on Home where applicable).
- **NAV-03 — Plant sub-views:** From the plant detail page, the user can access the edit page (PLANT-03), the photo carousel (PHOTO-06), the watering calendar (WATER-11), the fertilizing calendar (FERT-02), the weight graph (WEIGHT-04), and the height graph (HEIGHT-04).
- **NAV-04 — Settings page:** A settings page, reachable from the app header and not a main tab, gives access to storage information (STORE-03), export and import (BACKUP-01, BACKUP-02), and notification settings (REM-08).

### 2.10 Storage (STORE)

- **STORE-01 — Persist locally:** Plant records, care history, weight records, height records, reminder configuration, and photo metadata persist in local device storage.
- **STORE-02 — Store photos locally:** Photo files or blobs are stored in the device's local database and remain available when the app is offline.
- **STORE-03 — Show storage information:** The user can check current storage usage and the available storage limit reported by the browser where supported.
- **STORE-04 — Handle storage errors:** The app must surface a clear error if a photo or other data cannot be saved because storage is unavailable or full.
- **STORE-05 — Request persistent storage:** The app calls `navigator.storage.persist()` to ask the browser not to evict local data, and shows whether persistent storage was granted where the browser reports it.

### 2.11 Backup (BACKUP)

- **BACKUP-01 — Export data:** The user can export plants, care history, weight records, height records, photo metadata, and locally stored photos. The export is a single `.zip` archive containing:
  - a `data.json` file with a `schemaVersion` number, the export date, and all structured records;
  - a `photos/` folder with the photo files, referenced from `data.json`.
- **BACKUP-02 — Import data:** The user can import a previously exported backup. The import replaces all currently saved data. Before importing, the app validates the archive (structure and `schemaVersion`) and shows a clear confirmation explaining that existing data will be replaced. If validation fails or the backup comes from a newer schema version than the app supports, existing data is left unchanged and a clear error is shown. The replacement is all-or-nothing.
- **BACKUP-03 — Backup warning:** The app warns the user when data exists and no export has been made yet, or when the last export is older than 30 days. The date of the last export is stored locally.

## 3. Data model

The exact database schema may evolve during implementation, but the domain model must represent the following entities.

**Dates:** A "local calendar date" is stored as a `YYYY-MM-DD` string in the user's local time zone, not as a timestamp, to avoid time-zone shifts. `createdAt` fields are timestamps.

### Plant

- `id`
- `name`
- `type` (optional, free-form text)
- `notes`
- `wateringIntervalDays` (optional)
- `createdAt`

### Plant photo

- `id`
- `plantId`
- `image` (compressed image blob, stored in the local database)
- `mimeType`
- `width`, `height`
- `sizeBytes`
- `takenAt` (local calendar date of the photo)
- `dateSource` (`exif`, `default`, or `manual`)
- `description` (optional)
- `createdAt`

Photos must be linked to a plant and deleted when their plant is permanently deleted. Photo files originate from user uploads only (PHOTO-02) and are compressed before storage (PHOTO-05).

### Care action

- `id`
- `plantId`
- `type` (`watering` or `fertilizing`)
- `action`:
  - for `watering`: `watered`, `snoozed`, or `dismissed`;
  - for `fertilizing`: `fertilized`.
- `date` (local calendar date)
- `createdAt`

Every watering resolution is retained, including snoozed and dismissed reminders. The most recent watering action is the reference for calculating the next watering date (see WATER-04). Creating a plant adds a first `watered` action (WATER-02).

### Weight record

- `id`
- `plantId`
- `weightGrams` (weight of the plant in grams, stored as a whole number)
- `date` (local calendar date)
- `createdAt`

Weight records are optional, stored in the local database, linked to a plant, and deleted when their plant is permanently deleted. They provide the data series for the weight evolution graph.

### Height record

- `id`
- `plantId`
- `heightCm` (height of the plant in centimeters)
- `date` (local calendar date)
- `createdAt`

Height records are optional, stored in the local database, linked to a plant, and deleted when their plant is permanently deleted. They provide the data series for the height evolution graph. Height values may be decimals (for example 12.5 cm).

### App settings

- `onboardingCompleted`
- `lastBackupAt`
- notification preferences (enabled or disabled)

## 4. Technical stack and architecture

### 4.1 Application stack

- **Framework:** Nuxt 4, in SPA mode (`ssr: false`). The app is client-only, which avoids hydration problems with IndexedDB.
- **UI runtime:** Vue 3
- **Language:** TypeScript
- **State management:** Pinia
- **Application type:** Responsive PWA with offline-first behavior
- **PWA:** `@vite-pwa/nuxt`. When a new version of the app is available, the app asks the user before updating.
- **Persistence:** IndexedDB through the Dexie wrapper
- **Charts:** Chart.js, for the weight and height evolution graphs
- **Icons:** Lucide icons through the Nuxt Icons integration
- **UI components and styling:** Nuxt UI, using its default green accent and theme customization where needed
- **Fonts:** Nuxt font-loading integration, using the standard font choice appropriate for the GitHub/VS Code/Nuxt UI-inspired interface
- **Testing:** Vitest
- **Backup format:** A `.zip` archive containing a versioned `data.json` and the photo files

### 4.2 Runtime architecture

The application is client-side and local-first:

1. Vue components render collection, plant detail, forms, reminders, storage, photo carousel, weight and height graphs, calendar, and onboarding views.
2. Pinia stores coordinate reactive application state and user actions.
3. A persistence layer (Dexie) maps the domain entities (including weight and height records) and photo blobs to IndexedDB.
4. A watering/reminder service derives status, due plants, and next watering dates from care action history.
5. A photo service reads the EXIF date, then downscales and compresses uploaded images.
6. A backup service validates and serializes local records and photos for export/import.
7. The PWA layer provides installability, offline application assets, and update prompts.

Domain calculations, especially watering-date calculation and reminder status, are kept independent of UI components so they can be tested with Vitest without rendering the application. The examples in section 2.2 serve as unit tests.

### 4.3 Offline behavior

- Previously saved plants, care data, weight records, height records, and photos must be available offline.
- Creating and editing data must work without a network connection.
- The app shell and required assets should be available after the PWA has been installed or initially cached.

### 4.4 Implementation notes

- **Object URLs for photos:** Photo blobs read from IndexedDB are displayed with `URL.createObjectURL`. These URLs must be revoked with `URL.revokeObjectURL` when no longer needed, to avoid memory leaks in long photo lists such as the carousel.
- **EXIF before compression:** Re-encoding an image removes its EXIF data, so the capture date must be read from the original file first.
- **Schema migrations:** Use Dexie schema versions for local database migrations, and keep `schemaVersion` in the backup format aligned with the data model.

## 5. UX and visual direction

- Use a simple, clean, calm plant-focused design.
- Use few and purposeful animations.
- Follow the visual language of GitHub, VS Code, and Nuxt UI.
- Use the default green accent from Nuxt UI.
- Use Lucide icons consistently rather than introducing multiple icon styles.
- Keep the interface accessible, including keyboard navigation, readable contrast, clear form labels, and useful empty and error states.
- English is the first supported language.

## 6. Open decisions

- **Notification delivery (REM-08):** True push notifications (delivered while the app is closed) normally require a server, which conflicts with the no-account, no-cloud design of v1. Without a server, notifications can only be local ones, whose reliability when the app is closed varies by browser and platform (iOS is the most limited). The exact mechanism must be chosen before implementation.
- **Libraries:** The ZIP and EXIF libraries are left to implementation.